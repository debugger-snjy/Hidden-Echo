"use client";

// Getting the Code Template From Next Auth JS Website
// Link : https://next-auth.js.org/getting-started/example#frontend---add-react-hook
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'

function signInPage() {

    // ! Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />
    // As we are using the useSession(), we have to wrap the code inside the SessionProvider
    // So, For that we will define the context that will provide the Wrapping of the SessionProvider to the childrens
    // And Then Import and use them in the app/page.tsx body tag 
    const { data: session } = useSession()

    if (session) {
        return (
            // Here, we have to wrap the code inside the div, if not wrapped inside div, then it will provide the following error
            // Error: Hydration failed because the initial UI does not match what was rendered on the server.
            <div>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
    return (
        // Here, we have to wrap the code inside the div, if not wrapped inside div, then it will provide the following error
        // Error: Hydration failed because the initial UI does not match what was rendered on the server.
        <div>
            Not signed in <br />
            <button onClick={() => signIn("credentials",)}>Sign in</button>
        </div>
    )

}

export default signInPage