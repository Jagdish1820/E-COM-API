// 1. Import express.
import express from 'express';
import ProductController from "./product.controller";

// 2. Initialize Express router.
const router = expres.Router();
const ProductController = new ProductController();

// All the paths to controller methods. 
// localhost/api/products
router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.addProduct);

export default router;
