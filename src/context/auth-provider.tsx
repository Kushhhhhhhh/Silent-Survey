'use client'
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        console.log("AuthProvider mounted")
        return () => {
            console.log("AuthProvider unmounted")
        }
    }, [])

    if (!children) {
        console.warn("AuthProvider rendered without children")
        return null
    }

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}