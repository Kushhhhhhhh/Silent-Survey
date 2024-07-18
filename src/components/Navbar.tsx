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
        <nav className="bg-white shadow-md p-4 md:p-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <a className="flex items-center text-2xl font-bold mb-4 md:mb-0 text-[#212121] hover:text-gray-900 transition-colors" href="#">
                        <Image
                            src='/favicon-ic.jpeg'
                            alt='Silent Survey Logo'
                            width={60}
                            height={60}
                            className="w-10 h-10 mr-2 rounded-full"
                            priority
                        />
                        Silent Survey
                    </a>
                </div>


                <div className="flex items-center">
                    {session ? (
                        <Button className="w-full md:w-auto ml-auto md:ml-0 rounded-2xl bg-[#212121] text-white hover:bg-black" onClick={() => signOut()}>Logout</Button>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto ml-auto md:ml-0 rounded-2xl bg-[#212121] text-white hover:bg-slate-900">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar