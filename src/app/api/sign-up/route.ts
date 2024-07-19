// This is the Signup Route for API
// Route : api/sign-up

// Importing the Database Connection
import connectToDB from "@/lib/dbConnect";

// Importing the User Model
import UserModel from "@/models/user.model";

// Importing the bcryptjs for Hashing Passwords
import bcrypt from 'bcryptjs';

// Importing the sendVerificationMail Function From Helper
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// Method : POST
// Route : /api/sign-up/route.ts
export async function POST(nextRequest: Request) {

    // Connecting to the Database
    await connectToDB();

    try {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Getting the Body Data in raw form
        const rawBodyData = await nextRequest.text();

        // Checking whether data is present in the Request Body or not
        if (!rawBodyData) {
            console.log("[src/app/api/sign-up/route.ts] rawBodyData : ", rawBodyData);
        }

        console.log("rawBodyData : ", rawBodyData)

        // Getting the Request Body Data in JSON
        const requestBody = JSON.parse(rawBodyData);

        // Destructing the Request Body Data
        const { username, email, password } = requestBody;


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Validating the User Registration By Username

        // Getting the Existing User Whose username is Successfully Verified
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        // That's mean the username is already registered with another user which is verified
        if (existingVerifiedUserByUsername) {
            console.error("[src/app/api/sign-up/route.ts] Error : Username is Already Exists");
            return Response.json(
                {
                    message: "User with this Username Already Exists",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Validating the User Registration By Email

        // Getting the Existing User Whose Email is already Registered
        const existingUserByEmail = await UserModel.findOne({
            email
        })

        // Here, If we have got something in the existingUserByEmail, 
        // then it means that User is already Registered by this email, we have to check for the user verification
        // If not, then it means that we have a New User and We have to register him/her from beginning

        // Generating the Verification Code (OTP)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                // Already a user is Verified with this Email Address
                console.error("[src/app/api/sign-up/route.ts] Error : User Already Exists with this Email");

                // Here, the code will not do to the Sending Verification Mail as we have returned Response Here only
                return Response.json(
                    {
                        message: "User Already Exists with this Email",
                        success: false
                    },
                    {
                        status: 400
                    }
                )
            }
            else {

                // Updating the User Data Again as earlier the user is not verified
                // So Registering again we will update the 
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                // TODO : Updating the Username as well
                existingUserByEmail.username = username;

                // Saving the Updated User Data
                await existingUserByEmail.save();

            }

        }
        else {
            // New User is Registering Here

            // hashing the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Setting up the verification Expiry
            const codeExpiryDate = new Date();
            // ! NOTE : When we use a 'new' keyword for creating Objects, They are getting Stored in the Memory as a
            // !        Reference and that can't be change, BUT the values of different fields inside the objects can be 
            // !        changeable.
            // ? So, Here doesn't matter what kind of variable we define, const or let, the values of the fields in the 
            // ? Object can be Changed. [Chai Aur Javascript]

            // Setting the Expiry Time for 1 Hour
            codeExpiryDate.setHours(codeExpiryDate.getHours() + 1);

            // Creating a New User
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: codeExpiryDate,
                isAcceptingMessage: true,
                allmessages: []
            });

            // Saving the New User
            await newUser.save();

        }

        // This Code will execute every time when the user is new or updating the user data if not verified
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Sending the Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        console.log("[src/app/api/sign-up/route.ts] emailResponse : ", emailResponse);

        // If Email not Sent Successfully
        if (!emailResponse.success) {
            console.error("[src/app/api/sign-up/route.ts] Error : Email not Sent Successfully,", emailResponse.message);
            return Response.json(
                {
                    message: "User with this Username Already Exists",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

        // Sending the Success Response
        console.error("[src/app/api/sign-up/route.ts] Email Sent Successfully, User Registered", emailResponse.message);
        return Response.json(
            {
                message: "User Registered Successfully, Please Verify Your Email",
                success: true
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.error("[src/app/api/sign-up/route.ts] Error : Error Registering User");
        console.log("[src/app/api/sign-up/route.ts] Error Details : ", error);

        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            },
            {
                status: 500
            }
        )
    }

}