// Route to handle the Verify the Verification Code for the user

// Importing the Function to Connect to Database
import connectToDB from "@/lib/dbConnect";

// Importing the User Model
import UserModel from "@/models/user.model";

// Method : POST
// Route : /api/verify-code
export async function POST(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Getting the Body Data in raw form
        const rawBodyData = await nextRequest.text();

        // Checking whether data is present in the Request Body or not
        if (!rawBodyData) {
            console.log("[src/app/api/verify-code/route.ts] Error : API Request Data is Empty");
            return Response.json(
                {
                    message: "API Request Data is Empty",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        console.log("[src/app/api/verify-code/route.ts] rawBodyData : ", rawBodyData)

        // Getting the Request Body Data in JSON
        const requestBody = JSON.parse(rawBodyData);

        // Checking whether the JSON have Data inside it or not
        if (Object.keys(requestBody).length === 0) {
            console.log("[src/app/api/verify-code/route.ts] Error : No Data Found in the Requested API");
            return Response.json(
                {
                    message: "No Data Found in the Requested API",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        // Destructing the Request Body Data
        const { username, code } = requestBody;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Validating the Data
        // TODO : Validate the Data using Functions

        // Decoding the username
        const decodedUsername = decodeURIComponent(username)

        // Finding the user with that username
        const verifyingUser = await UserModel.findOne(
            {
                username: decodedUsername
            }
        )

        // If No Verifying User Found 
        if (!verifyingUser) {
            console.log("[src/app/api/verify-code/route.ts] Error : User Not Found");
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                },
                {
                    status: 400
                }
            )
        }


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Checking the Verification Code

        const isCodeValid = verifyingUser.verifyCode === code;
        const isVerificationCodeNotExpire = new Date(verifyingUser.verifyCodeExpiry) > new Date()

        // If Verification Code is Correct and Verification Time Not Expired
        if (isCodeValid && isVerificationCodeNotExpire) {
            const verifiedUser = await UserModel.findByIdAndUpdate(verifyingUser._id, [
                {
                    $set: {
                        isVerified: true
                    }
                },
                {
                    $unset: [
                        'verifyCode',
                        'verifyCodeExpiry'
                    ]
                }
            ],
                { new: true }
            )

            console.log("[src/app/api/verify-code/route.ts] verifiedUser : ", verifiedUser);

            // If user is Not Verified
            if (!verifiedUser) {
                console.log("[src/app/api/verify-code/route.ts] Error : User Not Verified");
                return Response.json(
                    {
                        success: false,
                        message: "User Not Verified"
                    },
                    {
                        status: 400
                    }
                )
            }

            // Else it is Successfully Modified
            console.log("[src/app/api/verify-code/route.ts] User Verified Successfully");
            return Response.json(
                {
                    success: true,
                    message: "User Verified Successfully"
                },
                {
                    status: 200
                }
            )
        }

        // If Verification Time Expired
        else if (!isVerificationCodeNotExpire) {
            console.log("[src/app/api/verify-code/route.ts] Error : Your Verification Code has Been Expired, Please Signup Again to Get the New Code");
            return Response.json(
                {
                    success: false,
                    message: "Your Verification Code has Been Expired, Please Signup Again to Get the New Code"
                },
                {
                    status: 400
                }
            )
        }

        // If the Code is Invalid or Incorrect
        else {
            console.log("[src/app/api/verify-code/route.ts] Error : Your Verification Code is Incorrect");
            return Response.json(
                {
                    success: false,
                    message: "Your Verification Code is Incorrect"
                },
                {
                    status: 400
                }
            )
        }



    } catch (error) {
        console.log("[src/app/api/verify-code/route.ts] Error : Internal Server Error While Verifying the User");
        console.log("[src/app/api/verify-code/route.ts] error : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error while Verifying Code"
            },
            {
                status: 500
            }
        )
    }

}