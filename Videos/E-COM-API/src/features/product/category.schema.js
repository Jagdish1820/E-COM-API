import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema({
    name: String,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
