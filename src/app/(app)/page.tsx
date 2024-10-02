'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import messages from "@/data/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { useSession } from "next-auth/react";
import { User } from "@/model/User";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <section className="text-center mb-8 sm:mb-12">
          {session && (
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Welcome, {user?.username || user?.email} 👋
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4">Explore the Realm of Anonymous Conversations</h1>
          <p className="text-base sm:text-lg font-medium mt-2 max-w-2xl mx-auto">
            Silent Survey - Your Decentralized Hub for Secure and Anonymous Messaging.
          </p>
        </section>

        <section className="text-center mb-8 sm:mb-12">
          <Link href="/dashboard">
            <Button
              className="w-full sm:w-auto mt-3 px-6 py-3 sm:py-4 text-base sm:text-lg rounded-2xl bg-[#212121] text-white hover:bg-black transition-colors duration-300"
              disabled={!session || loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto animate-spin" />
              ) : (
                'Get Started'
              )}
            </Button>
          </Link>
        </section>

        <div className="max-w-6xl mx-auto my-8 sm:my-16">
          <Carousel className="w-full" plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
                    <CardHeader className="bg-[#212121] text-white text-center p-4">
                      <h3 className="text-lg sm:text-xl font-semibold">{message.title}</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-40 sm:h-48">
                      <span className="text-base sm:text-lg font-medium text-[#212121] text-center">{message.content}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300 hidden sm:flex" />
            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300 hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </main>
  );
}