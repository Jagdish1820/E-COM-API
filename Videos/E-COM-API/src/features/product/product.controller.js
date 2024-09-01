import ProductRepository from './product.repository.js';

export default class ProductController {

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, categories } = req.body;

      const cleanedName = name.replace(/^"|"$/g, '');
      const sizeArray = sizes ? sizes.split(',') : [];
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).send("Invalid price value");
      }

      const imageUrl = req.file ? req.file.path : null;

      const newProductData = {
        name: cleanedName,
        price: parsedPrice,
        sizes: sizeArray,
        categories: JSON.parse(categories),
        imageUrl
      };

      const createdProduct = await this.productRepository.add(newProductData);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      res.status(200).send(product);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async searchAndFilterProducts(req, res) {
    try {
      const { search, minPrice, maxPrice, categories, sizes } = req.query;

      const filters = {
        search,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        categories: categories ? categories.split(',') : undefined,
        sizes: sizes ? sizes.split(',') : undefined,
      };

      const products = await this.productRepository.searchAndFilterProducts(filters);
      return res.status(200).json(products);
    } catch (err) {
      console.log("Error searching and filtering products:", err);
      return res.status(500).send("Something went wrong");
    }
  }

  async rateProduct(req, res) {
    try {
      const { userID, productID, rating, comment } = req.body;
      const review = await this.productRepository.rate(userID, productID, rating, comment);
      res.status(201).send(review);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
