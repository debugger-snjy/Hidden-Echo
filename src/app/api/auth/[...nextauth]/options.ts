// This is the Main File for the Authentication as we will define all our options here, like using credentials or some other platform

// Importing the Next Auth Options Datatype or Interface
import { NextAuthOptions } from "next-auth";

// As, we  are following the Credentials Provider, so Importing the Credential Provider
import CredentialsProvider from "next-auth/providers/credentials"

// Importing bcrypt as we are dealing with the password
import bcrypt from 'bcryptjs';

// Importing the Database Connection
import connectToDB from "@/lib/dbConnect";

// Importing the User Model
import UserModel from "@/models/user.model";


// Defining the Auth Options
export const authOptions: NextAuthOptions = {

    providers: [

        // Adding the Credentials Provider to Validate the Username/Email and Password
        CredentialsProvider({
            // TODO : Might Need to Change
            id: "hiddenEcho-credentials",
            name: "Credentials",

            credentials: {
                emailOrUsername: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            // We have to use this Function to authorize, without that it will provide us with the Error
            // This method will return the user if it is successful or it should return the error or null if it is not successful
            // Now, the user that we are returning or coming from the authorize function, will be given to the provider and proceed further
            async authorize(credentials: any): Promise<any> {

                // Connecting to the Database
                await connectToDB();

                try {

                    // Fetching the User with Email or Username
                    const signInUser = await UserModel.findOne({
                        $or: [
                            { email: credentials.emailOrUsername },
                            { username: credentials.emailOrUsername }
                        ]
                    })

                    // If no user Found with that email or username
                    if (!signInUser) {
                        console.log("[src/app/api/auth/[...nextauth]/options.ts] Error : No user Found with this Email or Username");
                        return null;
                    }

                    // If the User is not Verified,
                    if (!signInUser.isVerified) {
                        console.log("[src/app/api/auth/[...nextauth]/options.ts] Error : Please Verify Your Account Before Login");
                        return null;
                    }

                    // Now, Checking the Password of the User
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, signInUser.password)

                    // If Password Compares and is Correct, then we return the user
                    if (isPasswordCorrect) {
                        return signInUser;
                    }
                    else {
                        console.log("[src/app/api/auth/[...nextauth]/options.ts] Error : Incorrect Credentials");
                        return null;
                    }

                } catch (error) {
                    console.log("[src/app/api/auth/[...nextauth]/options.ts] Error : User Not Authorized Successfully");
                    console.log("[src/app/api/auth/[...nextauth]/options.ts] error : ", error);
                    return null;
                }
            }

        }),
    ],

    // NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages
    pages: {
        // By default, the signIn will be rendered or provided on the '/auth/signin'
        // If we want to customize the page, we will provide the route for that page where we want the signin process
        // So, for SignIn we will be redirect to the /sign-in page which is in frontend
        signIn: '/sign-in',
    },

    // Defining the Session
    // Choose how you want to save the user session
    session: {
        strategy: "jwt"
    },

    // Defining the Secret Key
    secret: process.env.NEXT_AUTH_SECRET_KEY,

    // Callbacks are asynchronous functions you can use to control what happens when an action is performed
    callbacks: {

        // Using the JWT Callback
        // ? NOTE : Always Remember that the jwt function will always return the token
        // Here, the user refers to our User that we have returned from the authorize function in the provider
        async jwt({ token, user }) {

            // If User Exists
            if (user) {
                // Actually, here the user is taken from the datatype of the Auth user,
                // and that's why user doesn't contain the fields that our User Contains like _id, verifyCodeExpiry etc . . .
                // so, we have to modify the default user datatype of the Next Auth,
                // Modified the User Interface in the 'src/types/next-auth.d.ts', types is a default folder where the types files or declare files are placed
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },

        // Using the Session Callback
        // ? NOTE : Always Remember that the session function will always return the session
        async session({ session, token }) {

            if (token) {
                // Here also, we have an error, because the session object doesn't contain the user as well as
                // user doesn't contain the _id, So we have to redefine/modify the Session Type in
                // After Modifying the interface, we will save the token data into the session
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }

            return session
        },
    }
}