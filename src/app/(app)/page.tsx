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
    <main className="flex flex-col items-center justify-between h-[80vh] py-12 px-4 md:px-24">
      <div className="w-full max-w-7xl mx-auto">
        <section className="text-center mb-4 md:mb-8">
          {session && (
            <div className="text-4xl md:text-5xl font-extrabold mb-4">
              Welcome, {user?.username || user?.email} 👋
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Explore the Realm of Anonymous Conversations</h1>
          <p className="text-lg font-medium mt-2">
            Silent Survey - Your Decentralized Hub for Secure and Anonymous Messaging.
          </p>
        </section>

        <section className="text-center mb-4 md:mb-8">
          <Link href="/dashboard">
            <Button
              className="w-full md:w-auto mt-3 px-6 py-4 text-lg rounded-2xl bg-[#212121] text-white hover:bg-black"
              disabled={!session || loading}
            >
              {loading ? (
                <Loader2 className="w-8 h-8 mx-auto animate-spin" />
              ) : (
                'Get Started'
              )}
            </Button>
          </Link>
        </section>

        <div className="max-w-6xl mx-auto my-16">
          <Carousel className="w-full" plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
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
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300 md:hidden" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-[#212121] text-white rounded-full hover:bg-gray-700 transition duration-300 md:hidden" />
          </Carousel>
        </div>
      </div>
    </main>
  );
}