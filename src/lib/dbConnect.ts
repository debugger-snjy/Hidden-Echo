// Importing the Mongoose
import mongoose from "mongoose";

// Creating the Schema Datatype for the Connection Object
type connectionObjectType = {
    isConnected?: number
    // Adding '?' to allow the optional values, i.e, we allow to add optional field
}

// Creating the Empty Connection Object
const connectionObj: connectionObjectType = {
}

// Asynchronous Function to Connect to the Database
// NOTE : Here, 'void' is not same as 'void' in other languages
// Here, 'void' means that I don't care about the datatype or doesn't matter what datatype should be
async function connectToDB(): Promise<void> {

    // Checking whether the connection is already exist or not
    if (connectionObj.isConnected) {
        console.log("[src/lib/dbConnect.ts] Database Connection Already Exists");
        return;
    }

    // If the Database is NOT Connected
    try {
        // Connecting the Database, if URI is Empty it will be handled in the Catch Block
        const db = await mongoose.connect(process.env.MONGO_URI || '')

        console.log("[src/lib/dbConnect.ts] db : ", db);

        connectionObj.isConnected = db.connections[0].readyState;
        // Ready State is a Number :
        // 0 = disconnected
        // 1 = connected
        // 2 = connecting
        // 3 = disconnecting
        // 99 = uninitialized

        console.log("[src/lib/dbConnect.ts] connectionObj.isConnected : ", connectionObj.isConnected);

        if (connectionObj.isConnected === 1) {
            console.log("[src/lib/dbConnect.ts] Database Connected . . .");
        }
        else if (connectionObj.isConnected === 0) {
            console.log("[src/lib/dbConnect.ts] Database Disconnected . . .");
        }

    } catch (error) {

        // Consoling the Error
        console.log("[src/lib/dbConnect.ts] Error : Database Connection Failed");
        console.log("[src/lib/dbConnect.ts] Error Details :", error);

        // Exiting the Process because if the database is not connected, then have no use of it
        process.exit(1);

    }

}

// Exporting the Function
export default connectToDB;