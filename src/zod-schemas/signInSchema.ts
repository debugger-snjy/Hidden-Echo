// Importing the Zod Package
import { z } from 'zod';

// Exporting the Sign In Schema
export const signInSchema = z.object({
    // 'identifier' is the production term, which is used for the field that we are using in Sign In Like here email
    // We can also use the email instead of 'identifier', but just to make it production and professional code
    identifier: z.string(),
    password: z.string()
})