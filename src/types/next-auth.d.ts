// Importing the NextAuth Package
import 'next-auth'

// Importing the DefaultSession from the next-auth
import { DefaultSession } from 'next-auth'

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! Why we are doing this and we can declare the interface as well and use that ?
// ? Here, If we are working on our code, then we can use the interface and work on it
// ? But, If we are importing any other package and we want to modify the module and make
// ? sure that the whole package gets aware of the updated schema and the fields then, we
// ? have to create a declare file and modify or redefine the modules that are needed

// We can redefine or modify the modules of the next-auth package 
declare module 'next-auth' {

    // Modifying the User Interface
    interface User {

        // Defining the _id as of the User Model
        _id?: string,

        // Defining the isVerified as of the User Model
        isVerified?: boolean,

        // Defining the isAcceptingMessages as of the User Model
        isAcceptingMessages?: boolean,

        // Defining the username as of the User Model
        username?: string,
    }

    // Modifying the Session Interface
    interface Session {

        // Adding the User Field in the Session Object
        user: {

            // Defining the _id as of the User Model
            _id?: string,

            // Defining the isVerified as of the User Model
            isVerified?: boolean,

            // Defining the isAcceptingMessages as of the User Model
            isAcceptingMessages?: boolean,

            // Defining the username as of the User Model
            username?: string,

        } & DefaultSession['user']
        // Adding the above line that means I need the user key doesn't matter that will be empty or having data
    }
}


// Another Way to Redefine and Modify the Module
declare module 'next-auth/jwt' {
    
    // Defining the JWT Interface
    interface JWT {

        // Defining the _id as of the User Model
        _id?: string,

        // Defining the isVerified as of the User Model
        isVerified?: boolean,

        // Defining the isAcceptingMessages as of the User Model
        isAcceptingMessages?: boolean,

        // Defining the username as of the User Model
        username?: string,
    }
}