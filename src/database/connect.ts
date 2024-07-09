import mongoose from "mongoose";


type ConnectionObj = {
    isConnected?:number
}

const connection:ConnectionObj ={}

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: 'trijon',
            bufferCommands: false,
        })
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        
        console.log(error);
        process.exit(1)
    }
}

export default dbConnect;