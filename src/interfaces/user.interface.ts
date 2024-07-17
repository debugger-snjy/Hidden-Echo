// Used For User Mongoose Model Schema Datatype
// Importing the Document from mongoose for Type Safety and maintaining the Structure in Typescript (Only needed in Typescript)
import { Document } from "mongoose";
import { Message } from "./message.interface";

// We have Defined the User Schema and also From this we are going to use them in the mongoose and Database,
// So, they are used to create Mongoose Document, that's why we have extended the Document in it
export interface User extends Document {

    // Variables needed in the Interface
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    allmessages: Message[]
}