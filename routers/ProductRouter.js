const express = require("express");
const multer = require("multer");
const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Companies = require("../models/Company");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./public/uploads/images/products");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

const upload = multer({
	storage: storage,
});

const router = express.Router();

router.get("/", (req, res) => {
	try {
		let products = [];
		Products.find()
			.limit(5)
			.populate("category")
			.populate("company")
			.exec(async (err, data) => {
				if (err) res.status(500).send(err);
				await Promise.all(
					data.map((item) => {
						let rating = item.rating;
						let obj = {...item._doc};
						obj.avgRating =
							(rating.oneStar * 1 + rating.twoStar * 2 + rating.threeStar * 3 + rating.fourStar * 4 + rating.fiveStar * 5) /
							(rating.oneStar + rating.twoStar + rating.threeStar + rating.fourStar + rating.fiveStar);
						obj.totalRatings = rating.oneStar + rating.twoStar + rating.threeStar + rating.fourStar + rating.fiveStar;
						delete obj.rating;
						products.push(obj);
					})
				);
				res.send({success: true, data: products});
			});
	} catch (errors) {
		res.send(errors);
	}
});

router.post("/", upload.single("image"), async (req, res) => {
	try {
		const product = new Products({...req.body, ...{image: "products/" + req.file.filename}});
		const response = await product.save();
		res.json(response);
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.put("/rate/:id", async (req, res) => {
	try {
		const obj = await Products.findById(req.params.id);
		console.log(obj);
		const rating = req.body.rating;
		if (rating && rating <= 5 && rating >= 1) {
			let stars = obj.rating;
			switch (rating) {
				case 1:
					stars.oneStar = (stars.oneStar || 0) + 1;
					break;
				case 2:
					stars.twoStar = (stars.twoStar || 0) + 1;
					break;
				case 3:
					stars.threeStar = (stars.threeStar || 0) + 1;
					break;
				case 4:
					stars.fourStar = (stars.fourStar || 0) + 1;
					break;
				case 5:
					stars.fiveStar = (stars.fiveStar || 0) + 1;
					break;
			}
			Products.findByIdAndUpdate(req.params.id, {rating: stars})
				.then((response) => {
					res.send({message: "Updated Successfully", success: true});
				})
				.catch((err) => {
					res.status(400).json({message: error.message, success: false});
				});
		} else {
			res.status(400).json({message: "Rating should be between 1-5", success: false});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({message: error.message, success: false});
	}
});

router.get("/search/:input", async (req, res) => {
	const input = req.params.input;
	try {
		const products = await Products.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		const categories = await Categories.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		const companies = await Companies.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		let response = {products, categories, companies};
		res.json(response);
	} catch (error) {
		console.log(error);
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
