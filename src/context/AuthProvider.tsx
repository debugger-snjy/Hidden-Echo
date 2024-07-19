// We will define the context that will provide the Wrapping of the SessionProvider to the childrens
// And Then Import and use them in the app/page.tsx body tag
"use client";

// Importing the Session Provider From the Next Auth
import { SessionProvider } from "next-auth/react"

// Exporting the Component that will be wrapping the HTML body or code inside the SessionProvider
export default function AuthProvider({
    // NOTE : we have to by default provide 'children' as parameter
    children
}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}