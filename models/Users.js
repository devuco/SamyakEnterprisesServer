const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {type: String, required: true, unique: true},
	address: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	imageUri: {
		type: String,
		required: false,
	},
});

const model = mongoose.model("Users", UsersSchema);

module.exports = model;
