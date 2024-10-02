'use client'
import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptmsgSchema } from "@/schema/acceptmsg-schema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/api-response"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptmsgSchema),
    defaultValues: { acceptMessages: false }
  })
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter((message) => message._id !== messageId))
    toast({
      title: 'Message deleted',
      description: 'Your message has been deleted',
    })
  }, [toast])

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const { data } = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', data.isAcceptingMessage || false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error fetching accept messages',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    if (!session?.user) {
      console.log("Session or user not available")
      return
    }
    setIsLoading(true)
    try {
      const { data } = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(data.messages || [])
      if (refresh) {
        toast({
          title: 'Messages refreshed',
          description: 'Your messages have been refreshed',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.error("Error fetching messages:", axiosError.response?.data)
      toast({
        title: 'Error fetching messages',
        description: axiosError.response?.data.message || "An unexpected error occurred",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, session])

  useEffect(() => {
    if (session?.user) {
      fetchMessages()
      fetchAcceptMessages()
    }
  }, [session, fetchMessages, fetchAcceptMessages])

  const handleSwitchChange = async () => {
    try {
      const { data } = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: data.message,
        variant: "default"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error in handling switch',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#212121]">
        <h2 className="text-4xl font-bold text-white">Please login</h2>
      </div>
    )
  }

  const { username } = session.user
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Copied to clipboard',
      description: 'Your text has been copied to clipboard',
    })
  }

  return (
    <main className="p-6 w-full min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold my-6 text-center">User Dashboard</h1>
      <div className="my-4">
        <h2 className="text-2xl mb-2 text-center">Copy your unique link</h2>
        <div className="flex flex-col md:flex-row justify-center items-center my-4">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="input input-bordered w-full md:w-1/3 rounded-2xl p-2 mr-0 md:mr-2 mb-2 md:mb-0 bg-white text-gray-700 border-gray-950 border-2"
          />
          <Button onClick={copyToClipboard} className="bg-gray-800 text-white hover:bg-black rounded-2xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Copy'}
          </Button>
        </div>
      </div>
      <div className="mb-4 flex flex-col md:flex-row justify-center items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="mr-0 md:mr-2 mb-2 md:mb-0"
        />
        <span className="text-xl">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator className="border-gray-600 border mb-4" />
      <Button
        className="border-gray-600 text-white bg-[#212121] rounded-full mb-4 self-center"
        variant="outline"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 flex-grow overflow-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center text-xl font-medium col-span-full">No messages found</p>
        )}
      </div>
    </main>
  )
}

export default Dashboard