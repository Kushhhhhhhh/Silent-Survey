'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import Image from "next/image"

const Navbar = () => {

    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="shadow-md p-2 md:p-3">
            <div className="container mx-auto flex justify-between items-center h-10">
                <div className="flex items-center">
                    <Link 
                    className="flex items-center text-lg sm:text-2xl font-bold text-[#212121] hover:text-gray-900 transition-colors" 
                    href="/">
                        <Image
                            src='/favicon-ic.jpg'
                            alt='Silent Survey Logo'
                            width={40}
                            height={40}
                            className="mr-2 rounded-full object-cover"
                            priority
                        />
                        <span className="inline text-md sm:text-xl">Silent Survey</span>
                    </Link>
                </div>

                <div className="flex items-center">
                    {session ? (
                        <Button className="px-4 sm:px-6 py-2 rounded-full bg-[#212121] text-white hover:bg-black transition-colors" onClick={() => signOut()}>Logout</Button>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="px-4 sm:px-6 py-2 rounded-full bg-[#212121] text-white hover:bg-slate-900 transition-colors">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar