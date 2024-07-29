"use client";

// Importing the UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Importing APIResponse Types
import { APIResponse } from '@/types/apiResponse';

// Importing the Zod Message Schema
import { messageSchema } from '@/zod-schemas/messageSchema';

// Importing the zodResolver to apply the zod schema in the form
import { zodResolver } from '@hookform/resolvers/zod';

// Importing the axios for API Calls
import axios, { AxiosError } from 'axios';

// Icon for Loading
import { Loader2 } from 'lucide-react';

// Importing the parameters from the URL 
import { useParams } from 'next/navigation'

// Importing React Components
import React, { useEffect, useState } from 'react'

// Importing the useForm Hook from react Hook Form
import { useForm } from 'react-hook-form';

// Importing Zod
import { z } from 'zod';


export default function AnonymousMessagePage() {

    // Getting the parameters from the URL, here taking the username from params
    const params = useParams<{ username: string }>();

    // State variables for Showing Loading in the Button
    const [isSendingMessage, setIsSendingMessage] = useState(false)

    // Creating the Toast Object
    const { toast } = useToast();

    // Function to send the message through an API
    const sendMessage = async (data: z.infer<typeof messageSchema>) => {

        // Starting the Loading Variable
        setIsSendingMessage(true);

        // Getting the response from the API of Sending Message
        try {
            const sendingMessageResponse = await axios.post(`/api/send-message`, {
                username: params.username,
                messageContent: data.content
            })

            // If Message Send Successfully
            if (sendingMessageResponse.data.success) {
                toast({
                    title: "Message Sent",
                    description: sendingMessageResponse.data.message,
                })
                userFeedbackForm.reset()
            }

            // If Message NOT Send Successfully
            else {
                toast({
                    title: "Message Not Sent",
                    description: sendingMessageResponse.data.message,
                    variant: "destructive"
                })
            }
        } catch (error) {

            // Getting the Errors
            const axiosError = error as AxiosError<APIResponse>;

            // Showing the Error Toast
            toast({
                title: "Error Sending the Message",
                description: axiosError.response?.data.message || "Failed to Send the Message",
                variant: "destructive"
            })

        }
        finally {

            // Closing the Loading for Sending Message
            setIsSendingMessage(false)
        }
    }

    // Creating the useForm Object for react-hook-form
    const userFeedbackForm = useForm<z.infer<typeof messageSchema>>(
        {
            // Resolver for Validating the Data from zod schema
            resolver: zodResolver(messageSchema),

            // setting the default values
            defaultValues: {
                content: ''
            }
        }
    )

    useEffect(() => {

        // Reloading the page when loading for sending message changes

    }, [setIsSendingMessage])

    return (
        <main className='p-20 w-2/3 mx-auto'>
            <h1 className='text-center text-black font-extrabold text-4xl'>
                Send Your Message
            </h1>

            {/* Defining the Form with useForm React-hook */}
            <Form {...userFeedbackForm}>

                {/* On Submitting the form, calling the sendMessage Function */}
                <form onSubmit={userFeedbackForm.handleSubmit(sendMessage)}>
                    <div className='mt-3'>
                        <FormField
                            name="content"
                            control={userFeedbackForm.control}
                            render={({ field }) => (
                                <FormItem className="mt-7 mb-2 relative">
                                    <FormLabel>Send Anonymous Message to <strong>@{params.username}</strong></FormLabel>
                                    <FormControl>
                                        <Textarea className='text-md' {...field}>
                                        </Textarea>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='text-center mx-auto mt-10'>

                        {/* Updating the button on submitting and Loading the API Response */}
                        {isSendingMessage === false ?
                            <Button disabled={userFeedbackForm.getValues('content') === '' ? true : false}>
                                Send
                            </Button>
                            :
                            <Button disabled={userFeedbackForm.getValues('content') === '' ? true : false}>
                                <Loader2 className='animate-spin mr-2' />
                                Sending Message
                            </Button>
                        }
                    </div>
                </form>
            </Form>

        </main>
    )
}
