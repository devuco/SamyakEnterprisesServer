const express = require("express");
const Users = require("../models/Users");

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const users = new Users(req.body);
		await users.save();
		res.json({success: true, data: users});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.post("/login", async (req, res) => {
	const {email, password} = req.body;
	try {
		const user = await Users.findOne({email, password});
		if (user) res.send({success: true, data: user});
		else res.status(401).send({success: false, message: "Email Id or Password is incorrect"});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.get("/", async (req, res) => {
	const users = await Users.find();
	res.send(users);
});

module.exports = router;
