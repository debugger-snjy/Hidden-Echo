"use client"

// Importing the message card component
import MessageCard from "@/components/MessageCard"

// Importing the Shadcn Components (Button, Separator, Switch, useToast)
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
// FIX :
// Importing the Message Interface to store the messages
import { Message } from "@/interfaces/message.interface"

// Importing the APIResponse type
import { APIResponse } from "@/types/apiResponse"

// Importing the schema for form Validation
import { acceptMessageSchema } from "@/zod-schemas/acceptMessageSchema"

// Importing zodResolver to implement the zod schema in the form
import { zodResolver } from "@hookform/resolvers/zod"

// Importing axios and AxiosError from axios
import axios, { AxiosError } from "axios"

// Importing Icons from Lucide-React
import { Loader2, RefreshCcw } from "lucide-react"

// Importing useSession from the next-auth
import { useSession } from "next-auth/react"

// Importing react hooks
import { useCallback, useEffect, useState } from "react"

// Importing useForm From react-hook-form
import { useForm } from "react-hook-form"

// Importing zod 
import { z } from "zod"

// Exporting the Components for Dashboard Page
export default function DashboardPage() {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Creating the Variables

    // Creating Variable messages for storing all the messages coming to the User
    const [messages, setMessages] = useState<Message[]>([])

    // Creating Variable isLoading for showing the loading in the page
    const [isLoading, setIsLoading] = useState(false)

    // Creating Variable isPageLoading for showing the loading on the page
    const [isPageLoading, setIsPageLoading] = useState(false)

    // Creating Variable isSwitchLoading for showing the loading for the switch change
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    // Getting the toast variable to show the toast messages
    const { toast } = useToast()

    // Creating the session variable to get the data from the session
    const { data: session } = useSession();

    // Function to handle the delete message on the UI for making it UI Optimized
    // This function is only responsible to delete the messages from the UI, Not from the backend
    const handleDeleteMessage = (messageId: string) => {

        // Setting the messages using the filter function, and not saving the deleted message
        setMessages(messages.filter((msg) => msg._id !== messageId))

    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Implementing the Zod Validations on the Form Data
    const formData = useForm<z.infer<typeof acceptMessageSchema>>({

        // resolver allow us to add the validations
        resolver: zodResolver(acceptMessageSchema),

        // setting the initial values of the form fields 
        defaultValues: {
            acceptMessages: session?.user.isAcceptingMessages || false
        }
    })

    // Getting the Data from the formData
    const { register, watch, setValue } = formData
    // register : This is used to set the input as the form fields, it is like giving the name to the input field
    // watch : This method will keep a watch on the Form Field value in which we have injected and return its latest value and return the value 
    //         when the value of that input get changed
    // setValue : This method is used to set the value of the input field that we defined in the form

    // Setting the Watch For the Accepting Message Switch
    const acceptMessagesWatchValue = watch('acceptMessages');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Defining API Functions

    // Function to fetch the Accepting Message Status of the User From the Database
    const fetchAcceptMessagesStatus = useCallback(async () => {

        // Loading the Switch for Accepting Messages
        setIsSwitchLoading(true);

        try {

            // Calling the API to fetch the message accepting status
            const acceptingMessageResponse = await axios.get<APIResponse>(`/api/accept-messages`);

            // If getting the success response
            if (acceptingMessageResponse.data.success) {

                // Setting the value of the acceptMessage Switch in the Dashboard
                setValue('acceptMessages', acceptingMessageResponse.data.isAcceptingMessages || false)

                // Problem : As we are using the auth-session and that session is getting updated when we focus on the browser tab causing toast to occur repetitively
                // TODO : Try to Solve the above Problem till then removing the success toast
                // Showing the Success Toast
                // toast({
                //     title: "Accepting Message Status Fetched Successfully",
                //     description: acceptingMessageResponse.data.message
                // })

            } else {

                // Showing the Error Toast
                toast({
                    title: "Error Fetching the Accepting Message Status",
                    description: acceptingMessageResponse.data.message || "Failed to fetch Message Settings",
                    variant: "destructive"
                })
            }

        } catch (error) {

            // Getting the Errors
            const axiosError = error as AxiosError<APIResponse>;

            // Showing the Error Toast
            toast({
                title: "Error Fetching the Accepting Message Status",
                description: axiosError.response?.data.message || "Failed to fetch Message Settings",
                variant: "destructive"
            })
        }
        finally {

            // Stop the Loading Switch for Accepting Messages
            setIsSwitchLoading(false)
        }

    },
        // Calling the function when the acceptMessage Switch Value changed
        [setValue]
    )

    // Function to fetch all the messages of the user
    const fetchAllMessages = useCallback(async (refresh: boolean = false) => {

        // Starting the Loading
        setIsLoading(true);
        setIsSwitchLoading(false)

        try {

            // Calling the API 
            const allMessagesResponse = await axios.get<APIResponse>(`/api/get-messages`);
            setMessages(allMessagesResponse.data.allmessages || []);

            if (refresh) {
                if (allMessagesResponse.data.success) {

                    // Showing the Success Toast
                    toast({
                        title: "Messages are Refreshed",
                        description: allMessagesResponse.data.message,
                    })

                }
                else {

                    // Showing the Error Toast
                    toast({
                        title: "Error Refreshing Messages",
                        description: allMessagesResponse.data.message,
                        variant: "destructive"
                    })
                }
            }
            else {

                // Problem : As we are using the auth-session and that session is getting updated when we focus on the browser tab causing toast to occur repetitively
                // TODO : Try to Solve the above Problem till then removing the success toast
                // toast({
                //     title: "All Messages Fetched Successfully",
                //     description: allMessagesResponse.data.message,
                // })
            }


        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>;

            // Showing the Error Toast
            toast({
                title: "Error Fetching the Messages",
                description: axiosError.response?.data.message || "Failed to Fetch Messages",
                variant: "destructive"
            })

        }
        finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }

    }, [setMessages])

    // Function to change the Accepting Message Status
    const handleAcceptingMessagesStatusChange = async () => {

        try {
            const acceptMessagesStatusChangingResponse = await axios.post<APIResponse>(`/api/accept-messages`, {
                isAcceptingMessages: !acceptMessagesWatchValue
            })

            if (acceptMessagesStatusChangingResponse.data.success) {
                setValue('acceptMessages', !acceptMessagesWatchValue)
                if (acceptMessagesWatchValue) {
                    toast({
                        title: "Accepting Messages Turned Off",
                        description: acceptMessagesStatusChangingResponse.data.message,
                    })
                }
                else {
                    toast({
                        title: "Accepting Messages Turned On",
                        description: acceptMessagesStatusChangingResponse.data.message,
                    })
                }
            }
            else {
                toast({
                    title: "Unable to Update the Accepting Message Status",
                    description: acceptMessagesStatusChangingResponse.data.message,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>;

            toast({
                title: "Error Fetching the Messages",
                description: axiosError.response?.data.message || "Failed to Fetch Messages",
                variant: "destructive"
            })
        }

    }

    // Use Effect Function
    useEffect(() => {

        // Starting the Page Loading
        setIsPageLoading(true)

        // If User is NOT Logged in 
        if (!session || !session.user) return

        // Fetching all the messages
        fetchAllMessages();

        // Fetching the Accepting Message Status of the user from the database
        fetchAcceptMessagesStatus();

        console.log(messages)

        // Stopped the Page Loading
        setIsPageLoading(false)

    }, [session, setValue, fetchAcceptMessagesStatus, fetchAllMessages])

    if (isPageLoading) {
        // TODO : Add a Proper Loading Spinner
        return <>Loading  . . . . </>
    }
    else {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Checking whether the user is logged in or not
        if (!session || !session.user) {
            return <></>
        }

        // Getting the User Data From the Session
        const loggedInUser = session?.user;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Creating the URL Using window Object

        // Creating the Base URL Variable
        const baseURL = `${window.location.protocol}//${window.location.host}`
        // window.location.protocol = http:
        // window.location.host = localhost:3000

        // Creating the Profile URL
        const profileUrl = `${baseURL}/user/${loggedInUser.username}`;


        // Function to copy the profile URL in the Clipboard
        const copyToClipboard = () => {

            // Copying the URL in the Clipboard
            navigator.clipboard.writeText(profileUrl)

            // Showing the Toast for Copied to Clipboard
            toast({
                title: "URL Copied !",
                description: "Your Unique Link is Copied",
            })
        };

        return (
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
                <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="input input-bordered w-full p-2 mr-2"
                        />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>

                <div className="mb-4">
                    <Switch
                        name="acceptMessages"
                        // {...register('acceptMessages')} // TODO : Might Need to Change this
                        checked={acceptMessagesWatchValue}
                        onCheckedChange={handleAcceptingMessagesStatusChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-2">
                        Accept Messages: {acceptMessagesWatchValue ? 'On' : 'Off'}
                    </span>
                </div>
                <Separator />

                <Button
                    className="mt-4"
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchAllMessages(true);
                    }}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCard
                                key={`${message._id}`}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <div>No messages to display.</div>
                    )}
                </div>
            </div>
        );
    }
}
