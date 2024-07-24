import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">

            {/* Wrapping the body inside the SessionProvider as we have to use NextAuth Authentication */}
            <AuthProvider>
                <body className={inter.className}>

                    <Navbar />
                    
                    {children}

                    {/* Importing the shadcn Toaster for showing Messages */}
                    <Toaster />

                </body>
            </AuthProvider>

        </html>
    );
}
