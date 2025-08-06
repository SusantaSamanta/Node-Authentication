import mongoose from "mongoose";
import dotenv from 'dotenv';   /// to access env file data we need this.
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);   //(`mongodb://127.0.0.1/countyApp`);
    } catch (error) {
        console.log("DB not connected........");
    }
    console.log("DB connected......");
}


/// we can use this connectDB method in app.js file 
