const express = require("express");
const {default: mongoose} = require("mongoose");
const Cart = require("../models/Cart");

const router = express.Router();

router.post("/", async (req, res) => {
	const body = req.body;
	const userId = req.headers.userid;
	try {
		const userCart = await Cart.findOne({userId});
		if (userCart) {
			const products = userCart.products;
			const cartId = userCart._id;

			const productIndex = products.findIndex((el) => body.product === el.product.toString());
			console.log(productIndex);
			if (productIndex > -1) {
				let product = products[productIndex];
				product.quantity = body.quantity;
				products[productIndex] = product;
			} else {
				products.push(body);
			}
			await Cart.findByIdAndUpdate(cartId, {products});
			res.json({success: true, message: "Updated SuccessFully"});
		} else {
			const cart = new Cart({userId, products: body});
			const response = await cart.save();
			res.json({success: true, message: "Updated SuccessFully"});
		}
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.get("/", async (req, res) => {
	const userId = req.headers.userid;
	try {
		const cart = Cart.findOne({userId})
			.populate("products.product", "image name price -_id")
			.exec((err, data) => {
				data.products.map((el) => {
					el.total = el.quantity * el.product.price;
				});
				res.json({success: true, data});
			});
	} catch (error) {
		res.json({success: false, message: error.message});
	}
});

module.exports = router;
