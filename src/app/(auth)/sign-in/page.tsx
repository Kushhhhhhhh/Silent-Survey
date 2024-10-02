"use client";

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signinSchema } from "@/schema/signin-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
  
    const form = useForm<z.infer<typeof signinSchema>>({
      resolver: zodResolver(signinSchema),
      defaultValues: {
        identifier: "",
        password: "",
      },
    })
  
    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
      setIsSubmitting(true)
      try {
          const result = await signIn('credentials', {
              identifier: data.identifier,
              password: data.password,
              redirect: false,
          })
  
          if (result?.error) {
              toast({
                  title: "Login Failed",
                  description: result.error,
                  variant: "destructive",
              })
          } else {
              // Login successful, proceed with verification
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              const verificationResponse = await fetch('/api/send-email', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      username: data.identifier,
                      email: data.identifier,
                      otp: otp,
                  }),
              });

              if (verificationResponse.ok) {
                  toast({
                      title: "Verification Email Sent",
                      description: "Please check your email for the verification code.",
                      variant: "default",
                  })
                  router.replace(`/verify/${data.identifier}`)
              } else {
                  console.error("Failed to send verification email");
                  toast({
                      title: "Error",
                      description: "Failed to send verification email. Please try again.",
                      variant: "destructive",
                  })
              }
          }
      } catch (error) {
          console.error("Login error:", error);
          toast({
              title: "Error",
              description: "An unexpected error occurred",
              variant: "destructive",
          })
      } finally {
          setIsSubmitting(false)
      }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">Welcome to Silent Survey</h1>
            <p className="mb-4">Sign In to your account</p>
          </div>
  
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
}

export default SignInPage