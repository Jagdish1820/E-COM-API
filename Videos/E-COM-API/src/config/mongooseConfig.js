import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config(); // Load environment variables from .env

const url = process.env.MONGODB_URI; // Ensure the environment variable is named MONGODB_URI

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected using Mongoose");
        await addCategories();
    } catch (err) {
        console.error("Error while connecting to DB:", err);
    }
};

async function addCategories() {
    const CategoryModel = mongoose.model("Category", categorySchema);
    const categories = await CategoryModel.find();
    if (!categories || categories.length === 0) {
        await CategoryModel.insertMany([
            { name: 'Books' },
            { name: 'Clothing' },
            { name: 'Electronics' }
        ]);
        console.log("Categories added");
    }
}
