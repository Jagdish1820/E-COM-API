import OrderRepository from "./order.repository.js";

export default class OrderController {
    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req, res, next) {
        try {
            const userId = req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is created");
        } catch (err) {
            console.log("Error placing order:", err);
            return res.status(500).send("Something went wrong");
        }
    }

    async getOrderHistory(req, res) {
        try {
            const userID = req.userID;
            const orders = await this.orderRepository.getOrderHistory(userID);

            if (!orders || orders.length === 0) {
                return res.status(404).send("No orders found for this user");
            }

            return res.status(200).json(orders);
        } catch (err) {
            console.log("Error retrieving order history:", err);
            return res.status(500).send("Something went wrong while retrieving order history");
        }
    }
}
