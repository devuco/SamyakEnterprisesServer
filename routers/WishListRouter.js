const express = require("express");
const Wishlist = require("../models/Wishlist");
const Products = require("../models/Products");

const router = express.Router();

router.post("/", async (req, res) => {
	const {userId} = req;
	const {productId} = req.query;

	try {
		//check for pid inrequest
		if (!productId) {
			res.status(400).json({success: false, message: "productId missing in request"});
		} else {
			const isValidPId = await Products.findById(productId);
			if (!isValidPId) {
				res.status(400).json({success: false, message: "productId is invalid"});
			} else {
				const wishlist = await Wishlist.findOne({userId});
				//check for wishlist exist in database for that user
				if (wishlist) {
					//if wishlist exist then check if pid is already in list
					const pidExists = await Wishlist.find({"products.product": productId});
					if (pidExists.length > 0) {
						//if pid is in list then remove it
						const productDelete = await Wishlist.findOneAndUpdate({userId}, {$pull: {products: {product: productId}}}, {new: true});
						res.json({success: true, data: productDelete});
					} else {
						//if pid is not in list then add it
						const updatedList = await Wishlist.findOneAndUpdate({userId}, {$push: {products: {product: productId}}}, {new: true});
						res.json({success: true, data: updatedList});
					}
				} else {
					//if wishlist not present then create wishlist for that user and add pid
					const createWishlist = new Wishlist({userId, products: [{product: productId}]});
					const createdData = await Wishlist.create({userId, products: [{product: productId}]});
					const updatedCreatedData = await createdData.populate("products.product");
					res.json({success: true, data: updatedCreatedData});
				}
			}
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({success: false, message: err.response});
	}
});

module.exports = router;
