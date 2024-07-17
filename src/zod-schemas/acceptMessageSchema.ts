// Importing the Zod Package
import { z } from 'zod';

// Exporting the Accept Message Schema
export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean()
})