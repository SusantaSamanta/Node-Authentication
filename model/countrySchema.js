import mongoose from "mongoose";

const countrySchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        detail: {
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

export const countryTable = mongoose.model("favCountry", countrySchema);



/*

console.log(`Country Name: ${data[targetIndex].name.common} (${data[targetIndex]})`);⭐
console.log(`Currency: ${data[targetIndex].currencies[Object.keys(data[targetIndex].currencies)[0]].name} - ${Object.keys(data[targetIndex].currencies)[0]}`);
console.log(`Capital: ${data[targetIndex].capital}`);⭐
console.log(`Flag: ${data[targetIndex].flags.svg}`);⭐
console.log(`Coat Of Arms: ${data[targetIndex].coatOfArms.svg}`);
console.log(`Population: ${data[targetIndex].population}`);⭐
console.log(`Continent: ${data[targetIndex].continents[0]}`);⭐
console.log(`Languages: ${Object.values(data[targetIndex].languages).join(', ')}`);
console.log(`ISD: ${Object.values(data[targetIndex].idd).join('')}`);
console.log(`ccTLD: ${data[targetIndex].tld[0]}`);



Country Name: India (IND)  
app.js:165 Currency: Indian rupee - INR
app.js:166 Capital: New Delhi
app.js:167 Flag: https://flagcdn.com/in.svg
app.js:168 Coat Of Arms: https://mainfacts.com/media/images/coats_of_arms/in.svg
app.js:169 Population: 1380004385
app.js:170 Continent: Asia
app.js:171 Languages: English, Hindi, Tamil
app.js:172 ISD: +91
app.js:173 ccTLD: .in

*/