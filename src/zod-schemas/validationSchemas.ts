// Importing Zod
import { z } from "zod";

// Username Validation using zod
export const usernameValidation = z
    .string()
    .min(2, `Username must be atleast 2 characters`)
    .max(20, `Username must be not more than 20 characters`)
    .regex(/^[a-zA-Z0-9-_]+$/, "Username must not contain special Characters")
