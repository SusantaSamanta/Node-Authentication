// we already connect db in app.js by using DB-Connection.js file

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }

);

export const user = mongoose.model('userDetail', userSchema); // in db module will be look like userDetail




