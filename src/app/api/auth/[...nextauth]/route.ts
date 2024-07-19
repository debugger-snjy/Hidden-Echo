// Importing the auth Options
import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// Creating the Handler
const handler = NextAuth(authOptions)

// Exporting the handler Function
// route.ts only accept the Methods that have Method Type like GET, POST, PUT, DELETE or PATCH ...
export {
    // Exporting the handler as GET Request
    handler as GET,
    // Exporting the handler as POST Request
    handler as POST,
}