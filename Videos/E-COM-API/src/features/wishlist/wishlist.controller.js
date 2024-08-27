import { WishlistRepository } from './wishlist.repository.js';

export class WishlistController {
    constructor() {
        this.wishlistRepository = new WishlistRepository();
    }

    async addToWishlist(req, res) {
        try {
            const userId = req.userID;
            const productId = req.body.productID;

            const updatedWishlist = await this.wishlistRepository.addProductToWishlist(userId, productId);

            return res.status(200).json(updatedWishlist);
        } catch (err) {
            console.log("Error adding product to wishlist:", err);
            return res.status(500).send("Something went wrong");
        }
    }

    async getWishlist(req, res) {
        try {
            const userId = req.userID;
            const wishlist = await this.wishlistRepository.getWishlistByUser(userId);

            if (!wishlist) {
                return res.status(404).send("Wishlist not found");
            }

            return res.status(200).json(wishlist);
        } catch (err) {
            console.log("Error retrieving wishlist:", err);
            return res.status(500).send("Something went wrong");
        }
    }

    async removeFromWishlist(req, res) {
        try {
            const userId = req.userID;
            const productId = req.params.productId;

            const updatedWishlist = await this.wishlistRepository.removeProductFromWishlist(userId, productId);

            if (!updatedWishlist) {
                return res.status(404).send("Wishlist not found or product not in wishlist");
            }

            return res.status(200).json(updatedWishlist);
        } catch (err) {
            console.log("Error removing product from wishlist:", err);
            return res.status(500).send("Something went wrong");
        }
    }
}
