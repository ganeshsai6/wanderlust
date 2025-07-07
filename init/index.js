const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const MONGO_URL="mongodb://localhost:27017/wanderlust";
main().then((res)=>console.log("connection is done")).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB= async ()=>{
    Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '68684dea58d98878d82f7260',
    }));

 // now all items have the owner field

    await Listing.insertMany(initData.data);
    console.log(initData.data);
};
initDB();