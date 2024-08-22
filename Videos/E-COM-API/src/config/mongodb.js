
// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const url = process.env.DB_URL;
// console.log("URL: "+url);

// let client;
// export const connectToMongoDB = ()=>{
//     MongoClient.connect(url)
//         .then(clientInstance=>{
//             client=clientInstance
//             console.log("Mongodb is connected");
//             createCounter(client.db());
//             createIndexes(client.db());
//         })
//         .catch(err=>{
//             console.log(err);
//         })
// }

// export const getClient = ()=>{
//     return client;
// }

// export const getDB = ()=>{
//     return client.db();
// }

// const createCounter = async(db)=>{
//     const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
//     if(!existingCounter){
//         await db.collection("counters").insertOne({_id:'cartItemId', value:0});
//     }
// }

// const createIndexes = async(db)=>{
//     try{
//         await db.collection("products").createIndex({price:1});
//         await db.collection("products").createIndex({name:1, category:-1});
//         await db.collection("products").createIndex({desc:"text"});
//     }catch(err){
//         console.log(err);
//     }
//     console.log("Indexes are created");
// }



import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL: " + url);

let client;

export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB is connected");
        await createCounter(client.db());
        await createIndexes(client.db());
    } catch (err) {
        console.log("Failed to connect to MongoDB:", err);
        throw new Error("Failed to connect to MongoDB");
    }
};

export const getClient = () => {
    if (!client) {
        throw new Error("MongoDB client is not initialized");
    }
    return client;
};

export const getDB = () => {
    if (!client) {
        throw new Error("MongoDB client is not initialized");
    }
    return client.db();
};

const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({ _id: "cartItemId" });
    if (!existingCounter) {
        await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
    }
};

const createIndexes = async (db) => {
    try {
        await db.collection("products").createIndex({ price: 1 });
        await db.collection("products").createIndex({ name: 1, category: -1 });
        await db.collection("products").createIndex({ desc: "text" });
    } catch (err) {
        console.log("Failed to create indexes:", err);
    }
    console.log("Indexes are created");
};
