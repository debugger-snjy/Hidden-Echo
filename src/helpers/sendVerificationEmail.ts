// This is response for sending the mails 

import { resendObj } from "@/lib/resend";
import VerificationEmailTemplate from "../../views/emails/verificationEmailTemplate";
import { APIResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<APIResponse> {

    try {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Sending the Email
        const { data, error } = await resendObj.emails.send({
            from: 'Hidden Echo <onboarding@resend.dev>',
            to: [email],
            subject: 'Hidden Echo | Verification Code Request',
            react: VerificationEmailTemplate({ username, otp: verifyCode }),
        });

        if (error) {

            // Sending the Error Response
            return {
                success: false,
                message: error.message
            }
        }

        // Sending the Success Response
        return {
            success: true,
            message: "Verification Email Sent Successfully",
            
        }

    } catch (emailError) {
        console.log("[src/helpers/sendVerificationEmail.ts] Error : Sending Verification Email Failed");
        console.log("[src/helpers/sendVerificationEmail.ts] emailError : ", emailError);

        // Sending the Error Response
        return {
            success: false,
            message: "Failed to Send Verification Email"
        }
    }

}