// Importing the Zod Package
import { z } from 'zod';

// Exporting the Verify Code Schema
export const verifySchema = z.object({
    code: z.string().length(6, "Verification Code should be 6 Digits Only")
})