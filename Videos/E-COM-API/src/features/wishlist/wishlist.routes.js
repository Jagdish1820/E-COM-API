import express from 'express';
import { WishlistController } from './wishlist.controller.js';

const wishlistRouter = express.Router();
const wishlistController = new WishlistController();

wishlistRouter.post("/", (req, res) => {
    wishlistController.addToWishlist(req, res);
});

wishlistRouter.get("/", (req, res) => {
    wishlistController.getWishlist(req, res);
});

wishlistRouter.delete("/:productId", (req, res) => {
    wishlistController.removeFromWishlist(req, res);
});

export default wishlistRouter;
