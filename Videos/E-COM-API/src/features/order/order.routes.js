import express from 'express';
import OrderController from './order.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.post("/", jwtAuth, (req, res, next) => {
    orderController.placeOrder(req, res, next);
});

orderRouter.get('/history', jwtAuth, (req, res) => {
    orderController.getOrderHistory(req, res);
});

export default orderRouter;
