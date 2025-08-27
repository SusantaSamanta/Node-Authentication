import mongoose from "mongoose";

const countrySchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        flag: {
            type: String,
        },
        capital: {
            type: String,
        },
        continent: {
            type: String,
        },
        languages: {
            type: String,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "userDetail",
            require: true,
        }
    },
    {
        timestamp: true,
    }
);

export const countryTable = mongoose.model("favoriteCountry", countrySchema);


// Country Name: India (IND)  
// app.js:165 Currency: Indian rupee - INR
// app.js:166 Capital: New Delhi
// app.js:167 Flag: https://flagcdn.com/in.svg
// app.js:168 Coat Of Arms: https://mainfacts.com/media/images/coats_of_arms/in.svg
// app.js:169 Population: 1380004385
// app.js:170 Continent: Asia
// app.js:171 Languages: English, Hindi, Tamil
// app.js:172 ISD: +91
// app.js:173 ccTLD: .in

