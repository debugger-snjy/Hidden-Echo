'use client'

// Importing the zodResolver from hookform
import { zodResolver } from "@hookform/resolvers/zod"

// Importing the Link from next
import Link from "next/link"

// Importing the useForm from react-hook-form
import { useForm } from "react-hook-form"

// Importing the zod
import * as z from "zod"

// Importing axios for API Calls
import axios, { AxiosError } from 'axios'

// Importing useEffect, useState from react
import { useEffect, useState } from "react"

// Importing useDebounceValue for Debouncing Functionality
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'

// Importing useToast for Creating the Toast Object
import { useToast } from "@/components/ui/use-toast"

// Importing useRouter for navigating the user to verify page on success signup
import { useRouter } from "next/navigation"

// Importing signUpSchema for checking the signup Data Validation
import { signUpSchema } from "@/zod-schemas/signUpSchema"

// Importing APIResponse Schema to send the API Response
import { APIResponse } from "@/types/apiResponse"

// Importing Form UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Importing Input Component
import { Input } from "@/components/ui/input"

// Imported Check, Loader2 and X Icon from 'lucide-react'
import { Check, Loader2, X } from "lucide-react"


// Component Function for the Signup
export default function SignUpPage() {


    // In Username, for every input change or character input, we want to check for the unique username in Database using API Request
    // But, If we call the API for every input, it will increase the API Calls to the Database
    // So, to control the API Calls on Input this is called debouncing technique, we are going to use the hooks and third party functions to achieve this

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Creating all the States here

    // For Username
    const [username, setUsername] = useState('');

    // For Unique Username Status
    const [uniqueUsernameStatus, setUniqueUsernameStatus] = useState('');

    // For Setting the Text Color of the uniqueUsernameStatus
    const [isUsernameUnique, setIsUsernameUnique] = useState(true);

    // For Loading State when checking the unique username
    const [isCheckingUniqueUsername, setIsCheckingUniqueUsername] = useState(false)

    // For Submitting the Form
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)

    // ! ERROR : Setting the Debounced Username, i.e., update the username value after 500 ms and then it will be used to send it in the API
    // ! const debouncedUsername = useDebounceValue(username, 500)

    // ? Actually here we are using the useDebounceValue instead we should use the useDebounceCallback, as we want the function to call after 500 ms
    // ? Also we will not use the setUsername Function, we will use the debounceVariable (here it is 'debounceSetUsername')
    const debounceSetUsername = useDebounceCallback(setUsername, 200)


    // Getting the Toast to show the Messages for Success and Error
    const { toast } = useToast()

    // Getting the Navigation Router
    const router = useRouter();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Implementing the Zod Validations on the Form Data
    const formData = useForm<z.infer<typeof signUpSchema>>({

        // resolver allow us to add the validations
        resolver: zodResolver(signUpSchema),

        // setting the initial values of the form fields 
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Implementing the useEffect Code because we want to call the
    // API for unique username check every time when the debounced
    // username change

    useEffect(
        // Callback Function
        () => {

            // Function to check the unique username validation using API
            const checkUsernameUnique = async () => {

                // If debouncedUsername have some value i.e, not empty
                if (username) {

                    // Setting the IsCheckingUsername variable to true, if we want to show the loading or progress in page
                    setIsCheckingUniqueUsername(true);

                    // Setting the Unique Username Status Message to Empty String
                    setUniqueUsernameStatus('')

                    // Calling the API for Checking the unique username
                    try {
                        // Getting the Response From the API
                        const checkUsernameUniqueResponse = await axios.get(`/api/check-username-unique?username=${username}`);

                        // console.log("[src/app/(auth)/sign-up/page.tsx] checkUsernameUniqueResponse : ", checkUsernameUniqueResponse);

                        // Setting the Unique Username Status Message
                        setUniqueUsernameStatus(checkUsernameUniqueResponse.data.message)

                        // Setting the isUsernameUnique to manipulate the styling as per that, i.e, Success = true for Green Text, Success = false for Red Text
                        setIsUsernameUnique(checkUsernameUniqueResponse.data.success)

                    } catch (error) {

                        // Getting the Errors in the form of AxiosError and Also defining the type to APIResponse to structure the error object
                        const axiosError = error as AxiosError<APIResponse>

                        // console.log("[src/app/(auth)/sign-up/page.tsx] axiosError : ", axiosError);

                        // Setting the Unique Username Status Message
                        setUniqueUsernameStatus(axiosError.response?.data.message ?? "Error Checking the Username")

                        // Setting the isUsernameUnique to manipulate the styling as per that, i.e, Success = true for Green Text, Success = false for Red Text
                        setIsUsernameUnique(false)
                    }
                    finally {

                        // Added the code in the finally because we want to execute this in both try and catch at the end, 
                        // so to optimize the code, we have added the code in the finally
                        // Finally Making the setIsCheckingUniqueUsername to false as the checking of username is done
                        setIsCheckingUniqueUsername(false)

                    }
                }
            }

            // Calling the Function
            checkUsernameUnique();

        },

        // Dependency Array, Call the above Callback every time when the username will changed
        [username]

    )

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Creating the onSubmit Function to Handle the Form Submit

    // To submit the form using react-hook we use the handleSubmit Function from react-hook
    // But in the background of react-hook code, the handleSubmit only helps to get the data of the form and then it calls the submit function that we define in the code separately
    // Here, also we are defining the submit function and named that as onSubmit and the data that we have added in the parameter, will be given from the handleSubmit Function Only
    // ? Also, the data that we are getting as the parameter we are type checking it with the signUpSchema AND This is Used in the Production [Check Line 237, We have used this Function in the handleSubmit]
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

        // Making the isSubmittingForm to true to show the loading or something else
        setIsSubmittingForm(true);

        try {

            // Calling the API for signing up
            const signUpResponse = await axios.post<APIResponse>('/api/sign-up', data);

            // console.log("[src/app/(auth)/sign-up/page.tsx] signUpResponse : ", signUpResponse);

            if (signUpResponse.data.success) {
                // Showing the Success Toast Message
                toast({
                    title: 'Sign Up Successfully',
                    description: signUpResponse.data.message
                })
            }
            else {
                // Showing the Error Toast Message
                toast({
                    title: 'Sign Up Failed',
                    description: signUpResponse.data.message,
                    variant: "destructive"
                })
            }

            // Navigating the User to the Verification Page for the Code that we have mailed
            router.replace(`/verify/${username}`)
            // Using the replace function to replace the url but making the hostname as previous

        } catch (error) {

            // Getting the Errors in the form of AxiosError and Also defining the type to APIResponse to structure the error object
            const axiosError = error as AxiosError<APIResponse>

            // Getting the Error Message
            let errorMessage = axiosError.response?.data.message

            // console.log("[src/app/(auth)/sign-up/page.tsx] axiosError : ", axiosError);

            // Showing the Error Toast Message
            toast({
                title: 'Signup Failed',
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
                        Join Hidden Echo
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                {/* As we are using the react-hook-form, so we don't need to manage or update the state variables using onChange as it is done by the react-hook-form only */}
                {/* Adding the Sign Up Form */}

                {/* This is the Form tag of the React Hook Package */}
                <Form {...formData}>

                    {/* This form is the HTML Tag and use the formData handleSubmit Function on Submitting the Form, handleSubmit will provide the data to the onSubmit Function (onSubmit Function is the Function created by us Line 166) */}
                    <form onSubmit={formData.handleSubmit(onSubmit)} className="">

                        {/* Adding Username Field */}
                        <FormField
                            name="username"
                            control={formData.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2 relative">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="false"
                                            placeholder="Username"
                                            {...field}
                                            onChange={(e) => {

                                                // This is done automatically in react-hook, we don't need to do that,
                                                // But here, we also want to set the username in the state variable that's why we are defining here

                                                // Updating the Form Data
                                                field.onChange(e);

                                                // Updating the Username State to check for the unique username
                                                debounceSetUsername(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {
                                        // Showing the Loader for Checking the Unique Username
                                        isCheckingUniqueUsername && <Loader2 className="animate-spin absolute top-[45%] right-[2%]" />
                                    }
                                    {/* <FormDescription>
                                        Enter Your Username
                                    </FormDescription> */}

                                    {/* Here, the Form Message is responsible to show the validation errors below the input tag */}
                                    {/* For Username, we don't need it as we are showing the errors in below in div on basis of isUsernameUnique */}
                                    {/* <FormMessage>
                                    </FormMessage> */}
                                </FormItem>
                            )}
                        />

                        {/* Showing the unique Username Validation Message */}
                        <div className="">
                            {
                                username ?
                                    isUsernameUnique ?
                                        // If Username is Available
                                        <div className="text-sm mt-0 text-green-500 flex items-center font-medium">
                                            <span>{uniqueUsernameStatus !== '' ? <Check className="w-5 stroke-[2px] inline-block mr-1" /> : <></>}</span>
                                            <span>{uniqueUsernameStatus}</span>
                                        </div>
                                        :
                                        // If Username is NOT Available
                                        <div className="text-sm mt-0 text-red-500 flex items-center font-medium">
                                            <span>{uniqueUsernameStatus !== '' ? <X className="w-5 stroke-[2px] inline-block mr-1" /> : <></>}</span>
                                            <span>{uniqueUsernameStatus}</span>
                                        </div>
                                    :
                                    <></>
                            }
                        </div>

                        {/* Adding Email Field */}
                        <FormField
                            name="email"
                            control={formData.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="false"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        Enter Your Email Address
                                    </FormDescription> */}
                                    <FormMessage>
                                    </FormMessage>
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
                                    {/* <FormDescription>
                                        Enter Your Password
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Adding the Submit Button */}
                        <button type="submit" className="text-white bg-black disabled:bg-gray-800 disabled:text-gray-400 p-3 mt-12 mb-2 px-10 text-center rounded-lg w-full" disabled={isSubmittingForm || !isUsernameUnique}>
                            {
                                isSubmittingForm ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                                        Please Wait
                                    </>
                                    :
                                    'Sign Up'
                            }
                        </button>
                    </form>
                </Form>

                {/* Adding the Sign In Page Link */}
                <div className="text-center mt-4">
                    <p>
                        Already a Member ? {' '}
                        <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )

}