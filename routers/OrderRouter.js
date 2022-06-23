const Order = require("../models/Order");
const User = require("../models/Users");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const userId = req.headers.userid;
	if (userId) {
		const orders = await Order.find({userId});
		res.json({success: true, data: orders});
	} else {
		res.json({success: false, message: "User not found"});
	}
});

module.exports = router;
