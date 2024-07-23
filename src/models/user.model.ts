// Importing the Mongoose and Schema
import mongoose, { Schema } from "mongoose";

// Importing the User DataType From the Interface
import { User } from "@/interfaces/user.interface";

// Importing the MessageSchema For Storing all the Messages
import { MessageSchema } from "./message.model";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defining the User Schema

const UserSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is Required"],
            trim: true,
            
            // TODO : We might need to add the unique field again
            // unique: true
        },
        email: {
            type: String,
            required: [true, "Email Address is Required"],
            unique: true,
            match: [/.+\@.+\..+/, "Please use a valid Email Address"]
        },
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verifyCode: {
            type: String,
        },
        verifyCodeExpiry: {
            type: Date,
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true
        },
        allmessages: [MessageSchema],
    }
)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defining the User Model

// As we know that Next JS is Running in the Edge Runtime, So it don't know that it was executed earlier or it is its first execution
// So, It will Check If User Model is already Present, then it will return the User Model, else it will create the New Model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

// mongoose.models.User as mongoose.Model<User>, Defining that mongoose.models.User is of User Type
// mongoose.model<User>("User", UserSchema), Will Create the Users Model in the Database by providing the Schema in arrow brackets

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exporting the Model

export default UserModel;
