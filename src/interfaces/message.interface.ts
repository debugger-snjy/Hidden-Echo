// Used For Message Mongoose Model Schema Datatype
// Importing the Document from mongoose for Type Safety and maintaining the Structure in Typescript (Only needed in Typescript)
import { Document } from "mongoose";

// We have Defined the Message Schema and also From this we are going to use them in the mongoose and Database,
// So, they are used to create Mongoose Document, that's why we have extended the Document in it
export interface Message extends Document {

    // Variables needed in the Interface

    content: string;   // this 'string' should be in lowercase as it is referring to the typescript string datatype
    createdAt: Date;
}