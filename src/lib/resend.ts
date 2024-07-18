import { Resend } from "resend";

export const resendObj = new Resend(process.env.RESEND_API_KEY)
