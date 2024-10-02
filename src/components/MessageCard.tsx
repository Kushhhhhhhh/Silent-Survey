import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { ApiResponse } from "@/types/api-response";

const MessageCard = ({
  message, onMessageDelete
}: {
  message: Message;
  onMessageDelete: (messageId: string) => void
}) => {

  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDeleteConfirm = async (messageId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
      toast({
        title: response.data.message,
      });
      onMessageDelete(messageId);
      setMessages(prevMessages => prevMessages.filter(m => m._id !== messageId));
    } catch (error) {
      console.log("Error in deleting message", error);
      toast({
        title: "Error",
        description: "Failed to delete the message.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden flex flex-col justify-between bg-[#212121] rounded-2xl shadow-lg h-[250px]">
      <CardContent className="px-6 py-4 text-white text-center flex-grow flex flex-col justify-between">
        <div>
          <p className="text-lg font-medium mb-2">{message.content}</p>
          <p className="text-sm text-gray-400 font-medium">Sent at: {new Date(message.createdAt).toLocaleString()}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4 flex items-center bg-white rounded-2xl space-x-1 w-full justify-center">
              <X className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium ml-2 text-[#212121]">Remove</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-lg shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                This action cannot be undone. This will permanently delete your
                message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleDeleteConfirm(message._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default MessageCard;