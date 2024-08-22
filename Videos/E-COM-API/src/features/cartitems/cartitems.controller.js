import CartIemModel from './cartItems.model.js';
import CartItemsRepository from './cartItems.repository.js';

export class CartItemsController {

  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      await this.cartItemsRepository.add(productID, userID, quantity);
      res.status(201).send('Cart is updated');
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartItemsRepository.get(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }


  async delete(req, res) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;

      console.log("Deleting cart item:", cartItemID, "for user:", userID);  // Logging

      const isDeleted = await this.cartItemsRepository.delete(userID, cartItemID);

      if (!isDeleted) {
        console.log("Cart item not found or doesn't belong to the user:", cartItemID);  // Logging
        return res.status(404).send("Item not found");
      }

      return res.status(200).send('Cart Item is removed');
    } catch (err) {
      console.log("Error deleting cart item:", err);  // Logging
      return res.status(500).send("Something went wrong");
    }
  }

}
