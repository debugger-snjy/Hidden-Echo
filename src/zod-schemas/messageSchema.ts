// Importing the Zod Package
import { z } from 'zod';

// Exporting the Message Schema
export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content must be at least 10 characters" })
        .max(300, { message: "Content must be no longer than 300 characters" })
})
