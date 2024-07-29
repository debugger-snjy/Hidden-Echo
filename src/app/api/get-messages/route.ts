// Route to Get all the messages of the LoggedIn User

// Importing getServerSession to get the session data
import { getServerSession } from "next-auth";

// Importing authOptions to get the data from the session
import { authOptions } from "../auth/[...nextauth]/options";

// Importing connectToDB
import connectToDB from "@/lib/dbConnect";

// Importing UserModel
import UserModel from "@/models/user.model";

// Importing Next-Auth User from the next-auth
import { User } from "next-auth";

// Importing the mongoose as we have to convert the string value to objectID
import mongoose from "mongoose";


// Method : GET
// Route : /api/get-messages/route.ts
export async function GET(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {

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

        // The _id that we are getting from the loggedInUser is in the form of string, as we have saved the _id in form of string in
        // interface while redefining or modifying it, View : [src/types/next-auth.d.ts]
        // we have to convert the id from string to objet id, because in aggregation pipelines, the string value will cause errors
        const userId = new mongoose.Types.ObjectId(loggedInUser._id)

        const userWithAllMessages = await UserModel.aggregate([

            // Pipeline 01 : Finding the User
            {
                $match: {
                    _id: userId
                }
            },
            // Pipeline 02 : Unwinding the messages, Separating the messages array to different objects
            {
                $unwind: '$allmessages'
            },
            // Pipeline 03 : Applying the Filters or Sorting things, here
            {
                $sort: {
                    'allmessages.createdAt': -1
                }
            },
            // Pipeline 04 : Grouping the Separated Data into one
            {
                $group: {
                    _id: '$_id',
                    allmessages: {
                        $push: '$allmessages'
                    }
                }
            }
        ])

        // Checking whether user Found
        if (!userWithAllMessages) {
            console.log("[src/app/api/get-messages/route.ts] Error : User Not Found");
            return Response.json(
                {
                    message: "User Not Found",
                    success: false
                },
                {
                    status: 401
                }
            )
        }

        // If No Message have been present in the user account, Sending the Success Response with Empty all messages
        if (userWithAllMessages.length === 0) {
            console.log("[src/app/api/get-messages/route.ts] User with all its messages Found");
            return Response.json(
                {
                    message: "No Messages Yet !!",
                    success: true,
                    allmessages: []
                },
                {
                    status: 200
                }
            )
        }

        // If User and its messages Found
        console.log("[src/app/api/get-messages/route.ts] User with all its messages Found");
        return Response.json(
            {
                message: "All Messages Fetched",
                success: true,
                allmessages: userWithAllMessages[0].allmessages
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("[src/app/api/get-messages/route.ts] Error : Internal Server Error While Getting the User Messages");
        console.log("[src/app/api/get-messages/route.ts] error : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error While Getting the User Messages"
            },
            {
                status: 500
            }
        )
    }

}