// Importing the Message Interface for Datatype/Schema in the response
import { Message } from "@/interfaces/message.interface";

// Importing the User Interface for Datatype/Schema in the response
import { User } from "@/interfaces/user.interface";

export interface APIResponse {

    // Common Parameters For Error and Success Response
    success: boolean;
    message: string;

    // Optional Parameters that we might need sometime while sending response
    user?: User;
    messages?: Array<Message>;
    isAcceptingMessages?: boolean;

    // TODO : Might Add Other Fields if Needed
}