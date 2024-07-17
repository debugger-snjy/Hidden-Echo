// Importing Zod
import { z } from "zod";

// Username Validation using zod
const usernameValidation = z
    .string()
    .min(2, `Username must be atleast 2 characters`)
    .max(20, `Username must be not more than 20 characters`)
    .regex(/^[a-zA-Z0-9-_]+$/, "Username must not contain special Characters")

// Exporting the Signup Schema, as it will contain many fields, so we will define object
export const signUpSchema = z.object({

    // Validation for Username
    username: usernameValidation,

    // Validation for Email
    email: z.string().email({ message: "Invalid Email Address" }),

    // Validation for Password
    password: z.string().min(6, { message: "Password Must Be Minimum 6 Characters" })

})