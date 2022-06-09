const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async (req, res, next) => {
	const deviceId = req.headers.deviceid;
	if (deviceId) {
		const token = jwt.sign({deviceId}, process.env.TOKEN_KEY, {expiresIn: "24h"});
		res.json({token});
	} else res.status(400).json({message: "deviceId missing", success: false});
});

module.exports = router;
