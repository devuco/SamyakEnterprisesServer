const Users = require("../models/Users");

const verifyUser = async (req, res, next) => {
	const userId = req.headers.userid;
	if (!userId) {
		return res.status(400).json({success: false, message: "UserId missing in request"});
	} else {
		try {
			await Users.findById(userId);
		} catch (err) {
			return res.status(401).send({success: false, message: "Invalid UserId"});
		}
		return next();
	}
};

module.exports = verifyUser;
