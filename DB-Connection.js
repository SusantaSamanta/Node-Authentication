import mongoose from "mongoose";
import dotenv from 'dotenv';   /// to access env file data we need this.
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);   //(`mongodb://127.0.0.1/countyApp`);
        console.log("DB connected......");
    } catch (error) {
        console.log("DB not connected........");
        console.log(error);
        
    }
}


/// we can use this connectDB method in app.js file 
