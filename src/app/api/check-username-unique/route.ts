// This Route will help to find whether the username is unique or not
// We are creating a special route because if we want the functionality like when user types the username, we will tell him/her 
// whether the username is available or not

// Importing the Database Connect
import connectToDB from "@/lib/dbConnect";

// Importing the user model
import UserModel from "@/models/user.model";

// Importing the zod
import { z } from "zod";

// Importing the usernameValidation Zod Schema
import { usernameValidation } from "@/zod-schemas/validationSchemas";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Creating the Query Schema for Username
// We have to create the query schema to check the validation of the username
// Creating the Query Schema [Convention for variable Name: <variableName>QuerySchema]
const usernameQuerySchema = z.object(
    {
        username: usernameValidation
    }
)


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defining the GET Function 
// Method : GET
// Route : /api/check-username-unique?username=data&phone=1234567890
// There may be other parameters as well
export async function GET(nextRequest: Request) {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking the Method Type [GET] => NOT NEEDED IN LATEST VERSIONS
    // ==> But In latest NextJS Versions, it is handled automatically, we don't need to handle that
    //     This was used in the Earlier Versions when we have page router
    if (nextRequest.method !== 'GET') {
        return Response.json(
            {
                success: false,
                message: 'Method Not Allowed'
            }
        )
    }

    // Connecting to the Database
    await connectToDB();

    try {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Getting the Parameters from URL
        const { searchParams } = new URL(nextRequest.url)

        // Getting the username from the query parameter
        const usernameQueryParams = {
            username: searchParams.get('username')
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Validating the Data with the Zod

        // we use safeParse to check whether the username follows the
        // validation that we have provided in the Zod Schema
        const usernameValidationResult = usernameQuerySchema.safeParse(usernameQueryParams);

        console.log("[src/app/api/check-username-unique/route.ts] usernameValidationResult : ", usernameValidationResult);

        // If Username validation failed
        if (!usernameValidationResult.success) {

            // zod will provide the error data as well and we can get the error and also get specific field errors like 'username'
            // format() will contain all the errors and thus we only select the errors related to username
            const usernameValidationErrors = usernameValidationResult.error.format().username?._errors || [];

            console.log(`[src/app/api/check-username-unique/route.ts] Error : ${usernameValidationErrors}`);
            return Response.json(
                {
                    success: false,
                    message: usernameValidationErrors.length > 0 ? usernameValidationErrors.join(', ') : 'Invalid Query Parameters Data'
                },
                {
                    status: 400
                }
            )
        }

        // Getting the Username From the Result
        const usernameValidationData = usernameValidationResult.data;
        const { username } = usernameValidationData

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Finding the Data in the Database for Uniqueness and Also Verified User
        const existingVerifiedUser = await UserModel.findOne(
            {
                username,
                // 
                isVerified: true
            }
        )

        // If User with the given username exists
        if (existingVerifiedUser) {
            console.log(`[src/app/api/check-username-unique/route.ts] Error : Username Already Exists`);
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken'
                },
                {
                    status: 400
                }
            )
        }

        // If Username is not registered or registered
        console.log(`[src/app/api/check-username-unique/route.ts] Username is Unique and Available`);
        return Response.json(
            {
                success: true,
                message: 'Username is available'
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("[src/app/api/check-username-unique/route.ts] Error : Checking Username Failed");
        console.log("[src/app/api/check-username-unique/route.ts] Error Description : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error Occurred While Checking for Username"
            },
            {
                status: 500
            }
        )
    }

}