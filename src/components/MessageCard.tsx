import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/interfaces/message.interface"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { APIResponse } from "@/types/apiResponse"

// Defining the Type of the Message Card Component
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        const deleteMessageResponse = await axios.delete<APIResponse>(`/api/delete-message/${message._id}`)

        if (deleteMessageResponse.data.success) {
            toast({
                title: "Message Deletion Failed",
                description: deleteMessageResponse.data.message,
                variant: "destructive"
            })
        }

        else {
            toast({
                title: "Message Deleted Successfully",
                description: deleteMessageResponse.data.message,
            })

            onMessageDelete(message.id)
        }

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className=""><X className="w-5 h-5" />Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}

export default MessageCard