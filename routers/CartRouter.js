const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

const router = express.Router();

router.post("/", async (req, res) => {
	const body = req.body;
	const userId = req.headers.userid;
	try {
		const discountedPrice = (await Product.findOne({_id: body.product})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		body.total = discountedPrice * body.quantity;

		//check if cart exists
		if (userCart) {
			const products = userCart.products;
			const cartId = userCart._id;

			const productIndex = products.findIndex((el) => body.product === el.product.toString());
			//check if product is already in cart
			if (productIndex > -1) {
				// let product = products[productIndex];
				// product.quantity = body.quantity;
				// product.total = body.total;
				// products[productIndex] = product;
				// await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal - product.total + body.total});
				// let object = {_id: product.product, quantity: product.quantity};
				res.status(400).json({success: false, message: "Product is already in cart"});

				//push product to cart
			} else {
				products.push(body);
				await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal + body.total});
				res.json({success: true, message: "Updated SuccessFully"});
			}

			//else create cart
		} else {
			const cart = new Cart({userId, products: body, netTotal: body.total});
			await cart.save();
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
				let netTotal = 0;
				data?.products?.map((el) => {
					el.total = el.quantity * el.product.discountedPrice;
					netTotal += el.total;
				});
				if (data) data.netTotal = netTotal;
				res.json({success: true, data: data ?? []});
			});
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.put("/", async (req, res) => {
	const body = req.body;
	const userId = req.headers.userid;
	if (body.quantity === 0) {
	}

	try {
		const discountedPrice = (await Product.findOne({_id: body.product})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		body.total = discountedPrice * body.quantity;
		const products = userCart.products;
		const cartId = userCart._id;

		const productIndex = products.findIndex((el) => body.product === el.product.toString());
		//check if product is already in cart
		if (productIndex > -1) {
			let product = products[productIndex];
			product.quantity = body.quantity;
			product.total = body.total;
			products[productIndex] = product;
			await Cart.findByIdAndUpdate(cartId, {products});
			const total = (await Cart.findOne({userId})).products.reduce((acc, el) => acc + el.total, 0);
			await Cart.findByIdAndUpdate(cartId, {netTotal: total});
			let object = {_id: product.product, quantity: product.quantity, netTotal: total, total: product.total};
			res.json({success: true, message: "Updated SuccessFully", data: object});

			//push product to cart
		} else {
			res.status(400).json({success: false, message: "Product is not in cart"});
		}
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
