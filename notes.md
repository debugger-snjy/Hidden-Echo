# Project Notes

## Documents Datatype in Mongoose

- Document and Model are distinct classes in Mongoose. The Model class is a subclass of the Document class. When you use the Model constructor, you create a new document.

    ```js
    const MyModel = mongoose.model('Test', newSchema({ name: String }));
    const doc = newMyModel();

    doc instanceof MyModel; // true
    doc instanceof mongoose.Model; // true
    doc instanceof mongoose.Document; // true
    ```

- In Mongoose, a "document" generally means an instance of a model. You should not have to create an instance of the Document class without going through a model.

## Workflow of Registering User (Algorithm)
- Code Should effectively handles both scenarios :
    - Registering a new user
    - Updating an existing but unverified user account with a new password and verification code

- Flow : [Might Update the Flow Later]
    ```js
    IF existingUserByEmail EXISTS THEN
        IF existingUserByEmail.isVerified THEN
            // The User is Already Saved in the Database
            success : false;
        ELSE
            // save the updated user
        END IF
    ELSE
        // Create a new user with he provided details
        // Save the New User
    END IF
    ```

## Adding Next Auth in the Project : 

- **Step 0 :** Install next-auth package for using NextAuth
- **Step 1 :** Create a folder `[...nextauth]` in the `/app/api/auth` Folder
- **Step 2 :** Create 2 Files in that `[...nextauth]` folder:
    - option.ts
    - route.ts
- **Step 3 :** Start by option.ts, Creates the authOptions of type NextAuthOptions and define all the necessary things, For all the options [[Auth Options Official Link](https://next-auth.js.org/configuration/options)] :
    - providers ([official link](https://next-auth.js.org/providers/)): 
        - Define the Authentication Mode like Github, Google, Twitter, Credentials and many more
        - In other Authentication Method like Github, Google it is much easier just refer the official website and copy paste the code in the options.ts file
        - In this we have used the Credential Mode i.e, Authenticating on the basis of Email/Username and Password and the below things are done only if we are using the credentials method
        - then In that function, we have few fields in the Object that we have to define :
            - id
            - name
            - credentials : having username/email and password types and label (As it will help to create the HTML Form by own)
            - authorize() : Important Function that is must to be defined, as it will handle the user authentication, we return null if user not found, else return the user object
    - pages ([official link](https://next-auth.js.org/configuration/pages)): 
        - It automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages
    - session ([official link](https://next-auth.js.org/configuration/options#session)):
        - Defining what kind of the session we want 'jwt' or 'database'
    - secret : 
        - A Secret Key String we have to define
    - callbacks ([official link](https://next-auth.js.org/configuration/callbacks)):
        - These are the IMPORTANT things in the Authentication
        - Callbacks are asynchronous functions you can use to control what happens when an action is performed.
        - In callback function, we need to redefine the interface for the user, session and jwt as we are going to save the user data in the token and session, To redefine/modify the interface we have to update the interfaces in the `src/types/next-auth.d.ts` file ([official link](https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties))
        - Different Callbacks : 
            - jwt():
                - They are having the user data that we are returning from the providers
                - token generally have an id of the user, and thus small payload
                - but adding other user data will increase the payload size but will help us to reduce the Database Requests
                - We will process that and store the needed data from the user in the token and return the token
            - session():
                - In this, we have the access to the token
                - So, we will take the necessary data from the token and save that in the session and then return the session
- **Step 4 :** Now, Import the authOptions in the route.ts from options.ts
- **Step 5 :** In route.ts, we create the handler using the authOptions
- **Step 6 :** Export the handler function in the Form of GET and POST Request because the route.ts only accept the function that have Method Type
- **Step 7 :** We have to create the middleware file to execute the authentication, From the NextAuth.js Website, we don't get the proper idea about how to use the middleware with integration to nextAuth ([NextAuth Link](https://next-auth.js.org/configuration/nextjs#middleware)). So we will get the middleware from the ([NextJS Official Site](https://nextjs.org/docs/app/building-your-application/routing/middleware))
    - We have to modify the config variable that means where my middleware will be executing and also middleware function to check for the authentication
    - Applying Authentication From NextJS : ([NextAuth Middleware](https://next-auth.js.org/configuration/nextjs#middleware))
    - Getting JWT Token from NextAuth : ([GetToken Link](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken))
- **Step 8 :** Created the Demo FrontEnd Page for Sign-in Copied From the Official Website [FrontEnd NextJS Code Template](https://next-auth.js.org/getting-started/example#frontend---add-react-hook)
- **Step 9 :** We got the Error `Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />`. So, To Solve this Create a AuthProvider Component that will be wrapping the Code inside the SessionProvider. Created the AuthProvider inside the context folder (`src/context/AuthProvider.tsx`). Code referred from [Session Provider Code](https://next-auth.js.org/getting-started/client#sessionprovider)
- **Step 10 :** Last Step will be Wrapping the body tag inside the `app/page.tsx` and it will be working fine.
- **Step 11 :** Customizations : 
    - sign-in page : we have to customize the sign-in page as per our needs/requirements
    - pages : we can also customize the pages routes like if we need `/user/register` instead of `/sign-in`, then we can do that as well

## Routing in NextJS
- If we want to group our routes in one single group, then we should use the round brackets in the folder name.
- That rounded folder name will not be considered as the route, it will be just to make the things organized.

## Debouncing Concept
- Debouncing is a programming technique used to limit the rate at which a function is executed. It ensures that a function is only called once after a certain period of time has elapsed since the last time it was called.

- This is particularly useful for handling events that may be triggered multiple times in quick succession, such as user input, window resizing, or scrolling.

- When dealing with events that can fire rapidly, like key presses, mouse movements, or window resizing, calling a function for every single event can lead to performance issues and unwanted behavior.

- Debouncing helps by delaying the execution of the function until the rapid events stop firing for a specified period of time.

### Common Use Cases for Debouncing
1. Search Input Fields: When a user types in a search box, you might want to wait until they stop typing before making a network request to fetch search results. Debouncing the input prevents sending multiple unnecessary requests.

2. Window Resize Events: When a user resizes the browser window, you might want to perform layout calculations or make adjustments. Debouncing the resize event handler ensures that these calculations only happen after the user has finished resizing.

3. Form Validation: In forms with real-time validation, you might want to validate input fields after the user stops typing, rather than on every key press.

### Hooks For Debouncing

- We can use the Debouncing Hooks from the [usehooks-ts](https://usehooks-ts.com/) package
- In that Library, there are many hooks that we can use for react/next js
- For Debouncing, we have 2 Functions Currently
    - `useDebounceCallback`
    - useDebounceValue

#### useDebounceCallback Hook

- Custom hook that creates a debounced version of a callback function.

- `useDebounceCallback` is used when you want to debounce a function (callback) that gets called frequently, like an event handler.
- The purpose is to limit the rate at which a function is invoked, ensuring it only runs after a certain amount of time has passed since the last invocation.

#### useDebounceValue Hook

- `useDebounceValue` is used when you want to debounce the update of a state value. It returns a debounced version of a state value that only updates after a specified delay.
- This is useful for controlling the update frequency of state values, particularly for optimizing performance or reducing the frequency of expensive operations like API calls.

### Key Differences

- Purpose:
    - useDebounceCallback: Debounces a function (callback) invocation.
    - useDebounceValue: Debounces the update of a state value.

- Usage:

    - useDebounceCallback: Useful for debouncing event handlers or any function calls.
    - useDebounceValue: Useful for debouncing state values, often used with controlled components and effects.

- API:

    - useDebounceCallback: Takes a callback function and a delay as arguments, returns a debounced version of the callback.
    - useDebounceValue: Takes a state value and a delay as arguments, returns a debounced version of the state value.

**_NOTE : Choosing between the two depends on your specific use case: use useDebounceCallback to control how often a function runs, and use useDebounceValue to control how often a state value updates._**