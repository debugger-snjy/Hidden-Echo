// Importing the Zod Package
import { z } from 'zod';

// Exporting the Sign In Schema
export const signInSchema = z.object({
    // 'identifier' is the production term, which is used for the field that we are using in Sign In Like here email
    // We can also use the email instead of 'identifier', but just to make it production and professional code
    identifier: z.string().min(1, { message: "Username or Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
})