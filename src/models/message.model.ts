// Creating the Message Schema Here, 
// As we are Creating the Schema in the typescript, then we have to define it's type as well

import { Message } from "@/interfaces/message.interface";
import { Schema } from "mongoose";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defining the Message Schema

export const MessageSchema: Schema<Message> = new Schema(
    {
        content: {
            type: String,   // In mongoose, we have 'String' Datatype in Pascal Format (First Letter Uppercase)
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
)