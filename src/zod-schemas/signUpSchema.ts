// Importing Zod
import { z } from "zod";

// Importing the Username Validation using zod from file
import { usernameValidation } from "./validationSchemas";

// Exporting the Signup Schema, as it will contain many fields, so we will define object
export const signUpSchema = z.object({

    // Validation for Username
    username: usernameValidation,

    // Validation for Email
    email: z.string().email({ message: "Invalid Email Address" }),

    // Validation for Password
    password: z.string().min(6, { message: "Password Must Be Minimum 6 Characters" })

})