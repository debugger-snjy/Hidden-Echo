// Route to Get all the messages of the LoggedIn User

// Importing getServerSession to get the session data
import { getServerSession } from "next-auth";

// Importing authOptions to get the data from the session
import { authOptions } from "../../auth/[...nextauth]/options";

// Importing connectToDB
import connectToDB from "@/lib/dbConnect";

// Importing UserModel
import UserModel from "@/models/user.model";

// Importing Next-Auth User from the next-auth
import { User } from "next-auth";

// Method : GET
// Route : /api/get-messages/route.ts
export async function DELETE(nextRequest: Request, { params }: { params: { messageid: string } }) {

    // Getting the Message ID
    const messageID = params.messageid;

    // Connecting to the Database
    await connectToDB();

    // Getting the data from the session
    const session = await getServerSession(authOptions);
    const loggedInUser: User = session?.user as User;

    // If Session or loggedInUser NOT Found
    if (!session || !loggedInUser) {
        console.log("[src/app/api/get-messages/route.ts] Error : User Not Authenticated");
        return Response.json(
            {
                message: "User Not Authenticated",
                success: false
            },
            {
                status: 401
            }
        )
    }

    try {
        const allMessagesAfterDeletingMessage = await UserModel.updateOne(
            {
                _id: loggedInUser._id
            },
            {
                $pull: {
                    allmessages: { _id: messageID }
                }
            }
        )

        if (allMessagesAfterDeletingMessage.modifiedCount === 0) {

            console.log("[src/app/api/delete-message/[messageid]/route.ts] Error : Message Not Found or Already Deleted");
            return Response.json(
                {
                    success: false,
                    message: "Message Not Found or Already Deleted",
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted Successfully",
            },
            {
                status: 200
            }
        )

    } catch (error) {

        console.log("[src/app/api/delete-message/[messageid]/route.ts] error : ", error);
        console.log("[src/app/api/delete-message/[messageid]/route.ts] Error : Error Deleting the Messages");
        return Response.json(
            {
                success: false,
                message: "Error Deleting the Messages",
            },
            {
                status: 500
            }
        )

    }

}