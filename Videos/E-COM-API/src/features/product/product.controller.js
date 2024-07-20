import ProductModel from "./product.model.js";

export default class ProductController {

    getAllProducts(req, res) {
        const products = ProductModel.getAll();
        res.status(200).send(products);
    }

    addProduct(req, res) {
        // console.log(req.body);
        // console.log("this is a post request");
        // res.status(200).send("Psot request received");
        const { name, price, sizes } = req.body;
        const newProduct = {
            name,
            price: parseFloat(price),
            sizes: sizes.splite(','),
            imageUrl: req.file.filename,
        };
        const createdRecord = ProductModel.add(newProduct);
        res.status(201).send(createdRecord);
    }

    rateProduct(req, res) {
        console.log(req.query);
        const userID = req.query.userID;
        const productID = req.query.productID;
        const rating = req.query.rating;
        const error = ProductModel.rateProduct(
            userID,
            productID,
            rating
        );
        console.log(error);
        if (error) {
            return res.status(400).send(error);
        }
        else {
            res
                .status(200)
                .send('Rating has been added');
        }
    }

    getOneProduct(req, res) {
        const id = req.params.id;
        const product = ProductModel.get(id);
        if (!product) {
            res.status(404).send('Product not found');

        } else {
            return res.status(200).send(product);
        }
    }

    filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const categary = req.query.categary;
        const result = ProductModel.filter(
            minPrice,
            maxPrice,
            category
        );
        res.status(200).send(result);
    }
}