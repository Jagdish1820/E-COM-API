import mongoose from "mongoose";
import { getClient, getDB } from "../../config/mongodb.js";
import { OrderModel } from "./order.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userId) {
        const client = getClient();
        const session = await client.startSession();
        try {
            session.startTransaction();

            const db = getDB();

            // 1. Get cart items and calculate total amount.
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);

            // 2. Create an order record.
            const newOrder = new OrderModel({
                userID: new mongoose.Types.ObjectId(userId),
                items: items.map(item => ({
                    productID: item.productID,
                    quantity: item.quantity,
                    price: item.productInfo.price
                })),
                totalPrice: finalTotalAmount,
                status: "Pending",
                createdAt: new Date()
            });
            await newOrder.save({ session });

            // 3. Reduce the stock.
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // 4. Clear the cart items.
            await db.collection("cartItems").deleteMany({ userID: new mongoose.Types.ObjectId(userId) }, { session });

            await session.commitTransaction();
            console.log("Order placed successfully and transaction committed.");
        } catch (err) {
            await session.abortTransaction();
            console.error("Transaction aborted due to an error:", err);
            throw new ApplicationError("Something went wrong with database", 500);
        } finally {
            session.endSession();
        }
    }

    async getTotalAmount(userId, session) {
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            { $match: { userID: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], { session }).toArray();
        return items;
    }

    async getOrderHistory(userID) {
        try {
            return await OrderModel.find({ userID: new mongoose.Types.ObjectId(userID) }).sort({ createdAt: -1 });
        } catch (err) {
            console.log("Error retrieving order history from database:", err);
            throw new Error("Failed to retrieve order history");
        }
    }
}
