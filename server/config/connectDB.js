import mongoose from "mongoose";
import dotenv, { configDotenv } from 'dotenv'
dotenv.config()
if(!process.env.MONGODB_URI){
    throw new Error(
        "please a URI"
    )
}
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected");
        
    } catch (error) {
        console.log("DB error",error);
        process.exit(1)
    }
    
}

export default connectDB