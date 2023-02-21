const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
	res.json({success: true, data: {}, message: "Token is valid"});
});

module.exports = router;
