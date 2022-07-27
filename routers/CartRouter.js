const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

const router = express.Router();

router.post("/", async (req, res) => {
	const {body, userId} = req;
	const {product: productId} = body;
	try {
		const discountedPrice = (await Product.findOne({_id: productId})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		let quantity = 1;
		let total = discountedPrice * quantity;

		//check if cart exists
		if (userCart) {
			const products = userCart.products;
			const cartId = userCart._id;

			const productIndex = products.findIndex((el) => productId === el.product.toString());
			//check if product is already in cart
			if (productIndex > -1) {
				quantity = products[productIndex].quantity;
				let product = products[productIndex].toObject();
				let prevTotal = product.total;
				quantity = quantity + 1;
				total = discountedPrice * quantity;
				product = {...product, quantity, total};
				console.log(quantity, total, userCart.netTotal);
				products[productIndex] = product;
				const response = await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal - prevTotal + total}, {new: true});
				res.json({success: false, data: response});

				//push product to cart
			} else {
				products.push({product: productId, quantity, total});
				const response = await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal + total}, {new: true});
				res.json({success: true, data: response});
			}

			//else create cart
		} else {
			let productBody = {
				product: productId,
				quantity: quantity,
				total,
			};
			console.log(productBody);
			const cart = new Cart({userId, products: [productBody], netTotal: total});
			await cart.save();
			res.json({success: true, message: "Updated SuccessFully"});
		}
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.get("/", async (req, res) => {
	const {userId} = req;
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
	const {userId} = req;
	try {
		const discountedPrice = (await Product.findOne({_id: body.product})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		let total = discountedPrice * body.quantity;
		const products = userCart.products;
		const cartId = userCart._id;

		const productIndex = products.findIndex((el) => body.product === el.product.toString());
		//check if product is already in cart
		if (productIndex > -1) {
			let product = products[productIndex];
			product.quantity = body.quantity;
			product.total = total;
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
	const {userId} = req;
	try {
		const cart = Cart.findOne({userId});
		if (cart) {
			cart.updateOne({userId}, {$pull: {products: {product: req.params.id}}}, (err, response) => {
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
