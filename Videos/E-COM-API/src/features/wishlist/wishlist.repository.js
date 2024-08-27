import { WishlistModel } from './wishlist.schema.js';
import { ObjectId } from 'mongodb';

export class WishlistRepository {
    async addProductToWishlist(userId, productId) {
        try {
            const wishlist = await WishlistModel.findOneAndUpdate(
                { user: new ObjectId(userId) },
                { $addToSet: { products: new ObjectId(productId) } },
                { new: true, upsert: true }
            ).populate('products');

            return wishlist;
        } catch (err) {
            console.log("Error adding product to wishlist:", err);
            throw new Error("Failed to add product to wishlist");
        }
    }

    async getWishlistByUser(userId) {
        try {
            return await WishlistModel.findOne({ user: new ObjectId(userId) }).populate('products');
        } catch (err) {
            console.log("Error retrieving wishlist:", err);
            throw new Error("Failed to retrieve wishlist");
        }
    }

    async removeProductFromWishlist(userId, productId) {
        try {
            const wishlist = await WishlistModel.findOneAndUpdate(
                { user: new ObjectId(userId) },
                { $pull: { products: new ObjectId(productId) } },
                { new: true }
            ).populate('products');

            return wishlist;
        } catch (err) {
            console.log("Error removing product from wishlist:", err);
            throw new Error("Failed to remove product from wishlist");
        }
    }
}
