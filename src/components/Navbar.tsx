"use client"

// Importing the React and other components
import React, { useEffect, useState } from 'react'

// Importing the Next Link
import Link from 'next/link'

// Importing useSession and signOut from next-auth
import { useSession, signOut } from 'next-auth/react'

// Importing the User Data from the next-auth
import { User } from 'next-auth'

// Importing the UI Components
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

// Importing useRouter for redirecting/replacing and usePathname for getting the path of the current URL
import { useRouter, usePathname } from 'next/navigation'

function Navbar() {

    // Importing the Session
    const { data: session } = useSession();

    // Creating the router object from useRouter
    const router = useRouter();

    // Creating the pathname object from usePathname that will provide the pathname of the current page
    const pathname = usePathname();

    // Getting the User Data
    const user: User = session?.user as User

    // Creating the toast object
    const { toast } = useToast();

    // Setting the Button Text
    const [buttonText, setButtonText] = useState(pathname.includes('sign-up') ? 'Login' : 'Sign up');

    // Created the logout function with toast and redirecting user to the sign-in page
    const logoutUser = async () => {
        await signOut();
        toast({
            title: "Logout Successfully",
            description: "You have been logged out from your Account",
        })
        router.replace("/sign-in")
    }

    useEffect(() => {
        if (pathname.includes('sign-up')) {
            setButtonText('Login');
        } else {
            setButtonText('Sign up');
        }
    }, [pathname]);

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0' href="#">Hidden Echo</a>
                {
                    session ?
                        (
                            <>
                                <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                                <Button className='w-full md:w-auto' onClick={logoutUser}>Logout</Button>
                            </>
                        )
                        :
                        (
                            <Link href={buttonText === 'Login' ? '/sign-in' : '/sign-up'}>
                                <Button className='w-full md:w-auto'>{buttonText}</Button>
                            </Link>
                        )
                }
            </div>
        </nav >
    )
}

export default Navbar
