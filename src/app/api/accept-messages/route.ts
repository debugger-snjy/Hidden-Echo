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

// Function to update the Accepting Message Status for the Feedbacks
// Method : POST
// Route : /api/accept-messages
export async function POST(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {

        // Getting the data from the session
        const session = await getServerSession(authOptions);
        const loggedInUser: User = session?.user as User;

        // If Session or loggedInUser NOT Found
        if (!session || !loggedInUser) {
            console.log("[src/app/api/accept-messages/route.ts] Error : User Not Authenticated");
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

        const userId = loggedInUser._id

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Getting the Body Data in raw form
        const rawBodyData = await nextRequest.text();

        // Checking whether data is present in the Request Body or not
        if (!rawBodyData) {
            console.log("[src/app/api/accept-messages/route.ts] Error : API Request Data is Empty");
        }

        console.log("rawBodyData : ", rawBodyData)

        // Getting the Request Body Data in JSON
        const requestBody = JSON.parse(rawBodyData);

        // Checking whether the JSON have Data inside it or not
        if (Object.keys(requestBody).length === 0) {
            console.log("Error : No Data Found for in the Request API");
            return Response.json(
                {
                    message: "No Data Found for in the Request API",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        // Destructing the Request Body Data
        const { isAcceptingMessages } = requestBody;


        // Updating the User Data
        const updatedLoggedInUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isAcceptingMessages: isAcceptingMessages
                }
            },
            { new: true }
        )

        // If updated user not found or updated
        if (!updatedLoggedInUser) {
            console.log("[src/app/api/accept-messages/route.ts] Error : Failed to update the User Message Status to accept Messages");
            return Response.json(
                {
                    message: "Failed to update the User Message Status to accept Messages",
                    success: false
                },
                {
                    status: 401
                }
            )
        }

        // If the user is updated successfully
        console.log("[src/app/api/accept-messages/route.ts] User Updated Successfully");
        return Response.json(
            {
                message: "User Updated Successfully",
                success: true
            },
            {
                status: 200
            }
        )

    } catch (error) {

        console.log("[src/app/api/accept-messages/route.ts] Error : Failed to update the User Message Status to accept Messages");
        console.log("[src/app/api/accept-messages/route.ts] error : ", error);

        return Response.json(
            {
                message: "Failed to update the User Message Status to accept Messages",
                success: false
            },
            {
                status: 500
            }
        )

    }

}

// Function that will return the isAcceptingMessages Status of the LoggedIn User
// Method : GET
// Route : /api/accept-messages/route.ts
export async function GET(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {
        // Getting the data from the session
        const session = await getServerSession(authOptions);
        const loggedInUser: User = session?.user as User;

        // If Session or loggedInUser NOT Found
        if (!session || !loggedInUser) {
            console.log("[src/app/api/accept-messages/route.ts] Error : User Not Authenticated");
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

        const userId = loggedInUser._id;
        const acceptingMessageUser = await UserModel.findById(userId)

        // If Accepting Message User not Found
        if (!acceptingMessageUser) {
            console.log("[src/app/api/accept-messages/route.ts] Error : User Not Found");
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

        // If Accepting Message User Found
        console.log("[src/app/api/accept-messages/route.ts] User Found : ", acceptingMessageUser);
        return Response.json(
            {
                message: "User Message Accepting Status Fetched Successfully",
                isAcceptingMessages: acceptingMessageUser.isAcceptingMessage,
                success: true
            },
            {
                status: 200
            }
        )

    } catch (error) {

        console.log("[src/app/api/accept-messages/route.ts] Error : Failed to fetch User Accepting Messages Status");
        console.log("[src/app/api/accept-messages/route.ts] error : ", error);

        return Response.json(
            {
                message: "Failed to fetch User Accepting Messages Status",
                success: false
            },
            {
                status: 500
            }
        )

    }

}
