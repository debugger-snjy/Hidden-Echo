import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/interfaces/message.interface"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { APIResponse } from "@/types/apiResponse"
import dayjs from 'dayjs'

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
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive" onClick={handleDeleteConfirm}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    );
}

export default MessageCard