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

export default function MainComponent() {
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
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

        try {
            await axios.post('/api/send-message', {
                username: username,
                content: message
            });
            toast({
                title: 'Message sent',
                description: 'Your message was sent successfully',
            });
            setMessage('');
        } catch (error) {
            toast({
                title: 'Error sending message',
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-center p-4">
            <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="p-6 text-center">
                    <CardTitle className="text-2xl font-bold">Public Profile Link</CardTitle>
                    <p className="text-gray-600 mt-2">Send an anonymous message to me</p>
                    <CardDescription className="text-gray-500 mt-2">Use the form below to send a message to our support team.</CardDescription>
                </CardHeader>
                <div className="p-6">
                    <form className="grid gap-4">
                        <Textarea
                            placeholder="Type your message here..."
                            className="min-h-[80px] p-2 border border-gray-300 rounded-md"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="bg-[#212121] text-white py-2 px-4 rounded hover:bg-black"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick();
                            }}
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </Card>
            <div className="mt-4 w-full max-w-md mx-auto">
                <SuggestMessageCard />
            </div>
        </div>
    );
}