import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    sizes: {
        type: [String],
        required: false,
    },
    // inStock: {
    //     type: Number,
    //     required: true,
    //     default: 1,
    // },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
    ratings: [
        {
            userID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]
}, {
    timestamps: true
});

// Check if the model is already defined to prevent OverwriteModelError
const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;
