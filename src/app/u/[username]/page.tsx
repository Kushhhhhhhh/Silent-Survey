'use client'
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import SuggestMessageCard from "@/components/SuggestMessageCard";
import { Loader2 } from "lucide-react";

export default function MainComponent() {
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const user = session?.user;
    const { username } = useParams();

    const handleClick = async () => {
        if (!user) {
            toast({
                title: 'Error sending message',
                description: 'Please login to send messages'
            });
            return;
        }

        if (!message.trim()) {
            toast({
                title: 'Error sending message',
                description: 'Message cannot be empty',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            console.log(`Sending message to ${username}`);
            await axios.post('/api/send-message', {
                username: username,
                content: message
            });
            console.log('Message sent successfully');
            toast({
                title: 'Message sent',
                description: 'Your message was sent successfully',
            });
            setMessage('');
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error sending message',
                description: error.response?.data?.message || 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
            <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <CardHeader className="p-6 text-center">
                    <CardTitle className="text-2xl font-bold mb-2">Public Profile Link</CardTitle>
                    <p className="text-gray-600 mb-2">Send an anonymous message to me</p>
                    <CardDescription className="text-gray-500">Use the form below to send a message to our support team.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="grid gap-4">
                        <Textarea
                            placeholder="Type your message here..."
                            className="min-h-[120px] p-3 border border-gray-300 rounded-md resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            className="bg-[#212121] text-white py-3 px-6 rounded hover:bg-black transition-colors duration-300"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'Send'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <div className="w-full max-w-md mx-auto">
                <SuggestMessageCard />
            </div>
        </div>
    );
}