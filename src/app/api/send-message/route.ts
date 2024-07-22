// This is the Route this will send the message from the unknown user to the feedback taking user

// Importing connectToDB Function 
import connectToDB from "@/lib/dbConnect";

// Importing Message Schema
import { Message } from "@/interfaces/message.interface";

// Importing the User Model
import UserModel from "@/models/user.model";


// Method : POST
// Route : /api/send-message
export async function POST(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Getting the Body Data in raw form
        const rawBodyData = await nextRequest.text();

        // Checking whether data is present in the Request Body or not
        if (!rawBodyData) {
            console.log("[src/app/api/send-message/route.ts] Error : API Request body is Empty");
            return Response.json(
                {
                    success: false,
                    message: "API Request Body is Empty"
                },
                {
                    status: 400
                }
            )
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
        const { username, messageContent } = requestBody;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Validating the Inputs
        // TODO : Remaining to Add the Validation

        // Finding the User
        const feedbackTakingUser = await UserModel.findOne({ username })

        // Checking whether the Feedback Taking user Exists
        if (!feedbackTakingUser) {
            console.log("[src/app/api/send-message/route.ts] Error : User Not Found");
            return Response.json(
                {
                    message: "User Not Found",
                    success: false
                },
                {
                    status: 404
                }
            )
        }

        // Checking Whether the User is Accepting the Messages or not
        if (!feedbackTakingUser.isAcceptingMessage) {
            console.log("[src/app/api/send-message/route.ts] Error : User is Not Accepting Messages Right Now");
            return Response.json(
                {
                    message: "User is Not Accepting Messages Right Now",
                    success: false
                },
                {
                    status: 403
                }
            )
        }

        // Storing the Message in the Variable
        const newMessage = {
            content: messageContent,
            createdAt: new Date()
        };

        // Pushing this Message in the User allmessages Array
        feedbackTakingUser.allmessages.push(newMessage as Message)
        // Here, Above we are using the message object as Message Object, as in schema of the user we have defined the allmessages 
        // as Array of Message

        // Saving the User Data in the Database
        await feedbackTakingUser.save();

        console.log("[src/app/api/send-message/route.ts] Message Sent Successfully");
        return Response.json(
            {
                message: "Message Sent Successfully",
                success: true
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("[src/app/api/get-messages/route.ts] Error : Internal Server Error While Sending the Message");
        console.log("[src/app/api/get-messages/route.ts] error : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error While Sending the Message"
            },
            {
                status: 500
            }
        )
    }

}
