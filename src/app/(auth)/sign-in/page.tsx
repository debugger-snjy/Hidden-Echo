'use client'

// Importing the zodResolver from hookform
import { zodResolver } from "@hookform/resolvers/zod"

// Importing the Link from next
import Link from "next/link"

// Importing the useForm from react-hook-form
import { useForm } from "react-hook-form"

// Importing the zod
import * as z from "zod"

// Importing useEffect, useState from react
import { useState } from "react"

// Importing useToast for Creating the Toast Object
import { useToast } from "@/components/ui/use-toast"

// Importing useRouter for navigating the user to verify page on success signup
import { useRouter } from "next/navigation"

// Importing signInSchema for checking the SignIn Data Validation
import { signInSchema } from "@/zod-schemas/signInSchema"

// Importing Form UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Importing Input Component
import { Input } from "@/components/ui/input"

// Imported Check, Loader2 and X Icon from 'lucide-react'
import { Loader2 } from "lucide-react"

// Importing the signIn Function from Next Auth to signin in the account
import { signIn } from "next-auth/react"


// Component Function for the Signup
export default function SignInPage() {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Creating all the States here

    // For Submitting the Form
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)

    // Getting the Toast to show the Messages for Success and Error
    const { toast } = useToast()

    // Getting the Navigation Router
    const router = useRouter();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Implementing the Zod Validations on the Form Data
    const formData = useForm<z.infer<typeof signInSchema>>({

        // resolver allow us to add the validations
        resolver: zodResolver(signInSchema),

        // setting the initial values of the form fields 
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Creating the onSubmit Function to Handle the Form Submit

    // To submit the form using react-hook we use the handleSubmit Function from react-hook
    // But in the background of react-hook code, the handleSubmit only helps to get the data of the form and then it calls the submit function that we define in the code separately
    // Here, also we are defining the submit function and named that as onSubmit and the data that we have added in the parameter, will be given from the handleSubmit Function Only
    // ? Also, the data that we are getting as the parameter we are type checking it with the signInSchema AND This is Used in the Production [Check Line 237, We have used this Function in the handleSubmit]
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        // Making the isSubmittingForm to true to show the loading or something else
        setIsSubmittingForm(true);

        // Calling the signIn Function of the Next-Auth
        // The Function will take 2 Parameters, First one will be the id of the provider that we have defined in the options of [...nextAuth]
        // The Second Parameter will be options and data that we have used for Provider
        const signInResponse = await signIn('hiddenEcho-credentials', {

            // Parameter that will check whether to redirect to another page if the login is successful, Here, we manually send to another page
            redirect: false,

            // Data that we got From the Login Form
            identifier: data.identifier,
            password: data.password
        })

        // Making the isSubmittingForm to false to hide the loading or something else
        setIsSubmittingForm(false);

        console.log("\n[src/app/(auth)/sign-in/page.tsx] signInResponse : ", signInResponse);

        // Showing the Errors using Toast
        if (!signInResponse?.ok) {
            if (signInResponse?.error) {
                if (signInResponse.error === "CredentialsSignin") {
                    toast({
                        title: "Login Failed",
                        description: "Incorrect Credentials",
                        variant: "destructive"
                    })
                }
                else {
                    toast({
                        title: "Login Failed",
                        description: signInResponse.error.toString(),
                        variant: "destructive"
                    })
                }
            }
            else {
                toast({
                    title: "Login Failed",
                    description: "Something Went Wrong While Logging . . .",
                    variant: "destructive"
                })
            }
        }

        // If we have got the Ok From the response, then we will show the success toast
        if (signInResponse?.ok) {

            console.log("\n[src/app/(auth)/sign-in/page.tsx] Signin Successful");
            toast({
                title: "Login Successfully",
                description: "Login Success",
            })

            router.replace('/dashboard');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Login to Hidden Echo
                    </h1>
                    <p className="mb-4">Sign In to start your anonymous adventure</p>
                </div>

                {/* As we are using the react-hook-form, so we don't need to manage or update the state variables using onChange as it is done by the react-hook-form only */}
                {/* Adding the Sign In Form */}

                {/* This is the Form tag of the React Hook Package */}
                <Form {...formData}>

                    {/* This form is the HTML Tag and use the formData handleSubmit Function on Submitting the Form, handleSubmit will provide the data to the onSubmit Function (onSubmit Function is the Function created by us Line 166) */}
                    <form onSubmit={formData.handleSubmit(onSubmit)} className="">

                        {/* Adding Email/Username Field */}
                        <FormField
                            name="identifier"
                            control={formData.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2 relative">
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email/Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Adding Password Field */}
                        <FormField
                            name="password"
                            control={formData.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="false"
                                            placeholder="Password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Adding the Submit Button */}
                        <button type="submit" className="text-white bg-black disabled:bg-gray-800 disabled:text-gray-400 p-3 mt-12 mb-2 px-10 text-center rounded-lg w-full" disabled={isSubmittingForm}>
                            {
                                isSubmittingForm ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                                        Please Wait
                                    </>
                                    :
                                    'Sign In'
                            }
                        </button>
                    </form>
                </Form>

                {/* Adding the Sign Up Page Link */}
                <div className="text-center mt-4">
                    <p>
                        Already a Member ? {' '}
                        <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )

}
