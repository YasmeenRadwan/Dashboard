import mongoose from "mongoose";

export const connectionDB = async() =>{
    try {
        await mongoose.connect(process.env.CONNECTION_DB_URI)
    } catch (error) {
        console.log("Error connected to database");  
    }
}
