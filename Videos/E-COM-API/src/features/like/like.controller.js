import { LikeRepository } from "./like.repository.js";

export class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async getLikes(req, res, next) {
        try {
            const { id, type } = req.query;

            // Check if both query parameters are provided
            if (!id || !type) {
                return res.status(400).send("Missing required query parameters: id and type");
            }

            const likes = await this.likeRepository.getLikes(type, id);

            if (!likes || likes.length === 0) {
                return res.status(404).send("No likes found for this item");
            }

            return res.status(200).json(likes);
        } catch (err) {
            console.log("Error retrieving likes:", err);
            return res.status(500).send("Something went wrong");
        }
    }

    async likeItem(req, res) {
        try {
            const { id, type } = req.body;
            
            if (!id || !type) {
                return res.status(400).send("Missing required body parameters: id and type");
            }

            if (type !== 'Product' && type !== 'Category') {
                return res.status(400).send("Invalid type specified");
            }

            if (type === 'Product') {
                await this.likeRepository.likeProduct(req.userID, id);
            } else {
                await this.likeRepository.likeCategory(req.userID, id);    
            }

            res.status(201).send("Like added successfully");
        } catch (err) {
            console.log("Error adding like:", err);
            return res.status(500).send("Something went wrong");
        }
    }
}
