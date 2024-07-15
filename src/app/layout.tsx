import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/auth-provider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Incognito Chat",
  description: "Discover the power of anonymity with our cutting-edge Next.js application. Seamlessly integrated with full-stack capabilities, this platform empowers users to send anonymous messages securely and effortlessly. Whether it's sharing secrets, giving feedback, or connecting with others without revealing your identity, our robust system ensures privacy and reliability at every step. Dive into a world where your voice is heard, but your identity remains confidential.",
  keywords: "anonymous messaging, Next.js, full-stack application, secure messaging, privacy, confidential communication, feedback platform, secret sharing",
  authors: [{ name: "Incognito Chat", url: "https://incognito-chat.vercel.app" }],
  creator: "Kush Sharma",
  publisher: "Kush Sharma",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}