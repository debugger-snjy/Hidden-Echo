"use client"

// Importing Form Components form the Form UI
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Importing Input Component from the Input UI
import { Input } from "@/components/ui/input";

// Importing Components for Input OTP Field
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

// Importing the toaster to show messages
import { useToast } from "@/components/ui/use-toast";

// Importing the APIResponse Type to send the response in that format
import { APIResponse } from "@/types/apiResponse";

// Importing the verify Schema from the ZOD
import { verifySchema } from "@/zod-schemas/verifySchema";

// Importing the zodResolver to resolve the zod schema
import { zodResolver } from "@hookform/resolvers/zod";

// Importing the Axios and AxiosError
import axios, { AxiosError } from "axios";

// Importing Loader2 Icon
import { Loader2 } from "lucide-react";

// Importing the Link
import Link from "next/link";

// Importing Router and Params
import { useParams, useRouter } from "next/navigation"

// Importing useState
import { useState } from "react";

// Importing useForm from the react-hook-form
import { useForm } from "react-hook-form";

// Importing all the zod functions as z
import * as z from 'zod';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Importing the Verify Page Component
export default function verifyPage() {

    // Creating the router object
    const router = useRouter();

    // Getting the parameters from the URL, here taking the username from params
    const params = useParams<{ username: string }>();

    // Creating the Toast Object
    const { toast } = useToast();

    // For Submitting the Form
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)

    // Creating the useForm Variable for Saving and Validating the Form Data in React-Hook Form
    const verifyFormData = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Function to Call when we have to submit the Form i.e, verify the code
    // It will take the Data From the handleSubmit an inbuilt function of the react-hook-form
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        // Making the isSubmittingForm to true to show the loading or something else
        setIsSubmittingForm(true);

        try {

            const verifyCodeResponse = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            if (verifyCodeResponse.data.success) {
                // Showing the Success Toast Message
                toast({
                    title: 'Verification Successfully',
                    description: verifyCodeResponse.data.message
                })
            }
            else {
                // Showing the Error Toast Message
                toast({
                    title: 'Verification Failed',
                    description: verifyCodeResponse.data.message,
                    variant: "destructive"
                })
            }

            // Navigating the User to the Verification Page for the Code that we have mailed
            router.replace(`/sign-in`)
            // Using the replace function to replace the url but making the hostname as previous

        } catch (error) {

            // Getting the Errors in the form of AxiosError and Also defining the type to APIResponse to structure the error object
            const axiosError = error as AxiosError<APIResponse>

            // Getting the Error Message
            let errorMessage = axiosError.response?.data.message

            // console.log("[src/app/(auth)/sign-in/page.tsx] axiosError : ", axiosError);

            // Showing the Error Toast Message
            toast({
                title: 'Verification Failed',
                description: errorMessage,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmittingForm(false);
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>

                {/* As we are using the react-hook-form, so we don't need to manage or update the state variables using onChange as it is done by the react-hook-form only */}
                {/* Adding the Sign Up Form */}

                {/* This is the Form tag of the React Hook Package */}
                <Form {...verifyFormData}>

                    {/* This form is the HTML Tag and use the verifyFormData handleSubmit Function on Submitting the Form, handleSubmit will provide the data to the onSubmit Function (onSubmit Function is the Function created by us Line 166) */}
                    <form onSubmit={verifyFormData.handleSubmit(onSubmit)}>

                        {/* Adding Code Field */}
                        <FormField
                            name="code"
                            control={verifyFormData.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2">

                                    {/* Adding the OTP Input Component */}
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup className="mx-auto border-[0px]">
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={0} />
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={1} />
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={2} />
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={3} />
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={4} />
                                            <InputOTPSlot className="border-[1px] border-gray-500 mx-2 rounded-md" index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Adding the Submit Button */}
                        <button type="submit" className={`text-white bg-black disabled:bg-gray-800 disabled:text-gray-400  p-3 mt-12 mb-2 px-10 text-center rounded-lg w-full ${isSubmittingForm ? 'bg-gray-800 text-gray-400' : ''}`} disabled={!verifyFormData.formState.isValid}>
                            {
                                isSubmittingForm ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                                        Verifying
                                    </>
                                    :
                                    'Verify Code'
                            }
                        </button>
                    </form>
                </Form>

                {/* Adding the Sign In Page Link */}
                <div className="text-center mt-4">
                    <p>
                        If Your Verification Code Expired, <br />
                        <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800 underline">Kindly Sign Up Again</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}