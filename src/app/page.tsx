'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { useSession } from "next-auth/react"
import { User } from "next-auth"

export default function Home() {

  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-12 px-4 md:px-24">
      <section className="text-center mb-4 md:mb-8">
        {session && (
          <div className="text-4xl md:text-5xl font-extrabold mb-4">
            Welcome, {user?.username || user?.email}👋
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Explore the Realm of Anonymous Conversations</h1>
        <p className="text-lg font-medium mt-2">Discover Incognito Chat – Your Decentralized Hub for Secure and Anonymous Messaging.</p>
      </section>

      <div className="max-w-xl w-full mb-40">
        <Carousel className="w-full" plugins={[Autoplay({ delay: 2000 })]}>
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-[#212121] text-white text-center p-4">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-lg font-medium text-[#212121]">{message.content}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300" />
        </Carousel>
      </div>

      <footer className="text-center p-3 md:p-5 bg-[#212121] text-white shadow-md w-full fixed bottom-0">
        &copy; 2024 Incognito Chat 👾
      </footer>
    </main>
  );
}