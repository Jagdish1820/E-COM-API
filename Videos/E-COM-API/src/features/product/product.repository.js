import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ProductModel from "./product.schema.js";
import ReviewModel from "./review.schema.js";
import CategoryModel from "./category.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {

    async add(productData) {
        try {
            let categories;
            if (typeof productData.categories === 'string') {
                try {
                    categories = JSON.parse(productData.categories);
                } catch (err) {
                    throw new ApplicationError("Invalid JSON format for categories", 400);
                }
            } else {
                categories = productData.categories;
            }
    
            const categoryDocs = await CategoryModel.find({ name: { $in: categories } }).select('_id');
            const categoryIds = categoryDocs.map(cat => cat._id);
    
            productData.categories = categoryIds;
    
            if (productData.inStock === undefined || isNaN(productData.inStock)) {
                productData.inStock = 1;
            }
    
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();
    
            await CategoryModel.updateMany(
                { _id: { $in: categoryIds } },
                { $push: { products: savedProduct._id } }
            );
    
            return savedProduct;
        } catch (err) {
            console.log(err);
            if (err instanceof ApplicationError) {
                throw err;
            } else {
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
    }
    
    async getAll() {
        try {
            return await ProductModel.find()
                .select('name price imageUrl sizes inStock')
                .populate({
                    path: 'categories',
                    select: 'name -_id'
                })
                .populate({
                    path: 'reviews',
                    select: 'rating comment -_id',
                    options: { limit: 10 } // Limits the number of reviews returned, if needed
                });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id) {
        try {
            return await ProductModel.findById(id)
                .select('name price imageUrl sizes inStock')
                .populate({
                    path: 'categories',
                    select: 'name -_id'
                })
                .populate({
                    path: 'reviews',
                    select: 'rating comment -_id',
                    options: { limit: 10 } // Limits the number of reviews returned, if needed
                });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // async filter(minPrice, categories) {
    //     try {
    //         let filterExpression = {};
    
    //         if (minPrice) {
    //             filterExpression.price = { $gte: parseFloat(minPrice) };
    //         }
    
    //         if (categories) {
    //             categories = JSON.parse(categories.replace(/'/g, '"'));
    
    //             // Convert category names to ObjectId
    //             const categoryDocs = await CategoryModel.find({ name: { $in: categories } }).select('_id');
    //             const categoryIds = categoryDocs.map(cat => cat._id);
    
    //             filterExpression.categories = { $in: categoryIds };
    //         }
    
    //         return await ProductModel.find(filterExpression)
    //             .select('name price imageUrl sizes inStock')
    //             .populate({
    //                 path: 'categories',
    //                 select: 'name -_id'
    //             })
    //             .populate({
    //                 path: 'reviews',
    //                 select: 'rating comment -_id',
    //                 options: { limit: 10 }
    //             });
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    async searchAndFilterProducts({ search, minPrice, maxPrice, categories, sizes }) {
        try {
            const query = {};

            // Search by name
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            // Filter by price range
            if (minPrice !== undefined && maxPrice !== undefined) {
                query.price = { $gte: minPrice, $lte: maxPrice };
            } else if (minPrice !== undefined) {
                query.price = { $gte: minPrice };
            } else if (maxPrice !== undefined) {
                query.price = { $lte: maxPrice };
            }

            // Filter by categories
            if (categories) {
                const categoryDocs = await CategoryModel.find({ name: { $in: categories } }).select('_id');
                const categoryIds = categoryDocs.map(cat => cat._id);
                query.categories = { $in: categoryIds };
            }

            // Filter by sizes
            if (sizes) {
                query.sizes = { $in: sizes };
            }

            return await ProductModel.find(query)
                .select('name price imageUrl sizes inStock')
                .populate({
                    path: 'categories',
                    select: 'name -_id'
                })
                .populate({
                    path: 'reviews',
                    select: 'rating comment -_id',
                    options: { limit: 10 }
                });
        } catch (err) {
            console.log("Error searching and filtering products:", err);
            throw new ApplicationError("Failed to search and filter products", 500);
        }
    }
    
    async rate(userID, productID, rating, comment) {
        try {
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating,
                comment: comment
            });

            await newReview.save();

            await ProductModel.findByIdAndUpdate(productID, {
                $push: { reviews: newReview._id }
            });

            return newReview;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with adding review", 500);
        }
    }

    async averageProductPricePerCategory() {
        try {
            return await ProductModel.aggregate([
                {
                    $unwind: "$categories"
                },
                {
                    $group: {
                        _id: "$categories",
                        averagePrice: { $avg: "$price" }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind: "$categoryDetails"
                },
                {
                    $project: {
                        _id: "$categoryDetails._id",
                        categoryName: "$categoryDetails.name",
                        averagePrice: 1
                    }
                }
            ]);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
}

export default ProductRepository;
