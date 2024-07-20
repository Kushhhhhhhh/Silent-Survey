'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/api-response"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"

export default function Component() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const { toast } = useToast()
  const user = session?.user
  const { username } = useParams()

  const handleClick = async () => {
    if (!user) {
      toast({
        title: 'Error sending message',
        description: 'Please login to send messages'
      })
      return;
    }

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: username,
        content: message
      })
      toast({
        title: 'Message sent',
        description: response.data.message,
      })
      setMessage('') 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error sending message',
        description: axiosError.response?.data.message || "An unexpected error occurred",
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Card className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="p-6 text-center">
          <CardTitle className="text-2xl font-bold">Public Profile Link</CardTitle>
          <p className="text-gray-600 mt-2">Send an anonymous message to me</p>
          <CardDescription className="text-gray-500 mt-2">Use the form below to send a message to our support team.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
                e.preventDefault()
                handleClick()
              }}
            >
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}