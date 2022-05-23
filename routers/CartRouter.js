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
			if (productIndex > -1) {
				let product = products[productIndex];
				product.quantity = product.quantity + body.quantity;
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
		Cart.findOne({userId})
			.populate("products.product", "image name price color discountedPrice discount")
			.exec((err, data) => {
				if (err) {
					res.status(400).json({success: false, message: err});
				}
				data?.products?.map((el) => {
					el.total = el.quantity * el.product.price;
				});
				res.json({success: true, data: data ?? []});
			});
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.delete("/:id", async (req, res) => {
	const userId = req.headers.userid;
	try {
		const cart = Cart.findOne({userId});
		if (cart) {
			cart.updateOne({userId}, {$pull: {products: {_id: req.params.id}}}, (err, response) => {
				if (response) {
					console.log(response);
					res.status(200).json({success: true, message: "updated successfully"});
				} else {
					res.status(400).json({success: false, message: err});
				}
			});
		} else {
			res.status(400).json({success: false, message: "Cart not found with this userID"});
		}
	} catch (err) {
		res.status(400).json({success: false, message: error.message});
	}
});

module.exports = router;
