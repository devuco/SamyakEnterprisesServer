const Order = require("../models/Order");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const {userid} = req.headers;
	const orders = await Order.find({userid}, "-products").sort({orderDate: -1});
	res.json({success: true, data: orders});
});
router.get("/:orderId", async (req, res) => {
	try {
		const order = Order.findOne({orderId: req.params.orderId, userId: req.headers.userid})
			.populate("products.product", "image name price color discountedPrice discount")
			.exec((err, data) => {
				if (err) {
					res.status(400).json({success: false, message: err});
				} else {
					res.json({success: true, data});
				}
			});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
