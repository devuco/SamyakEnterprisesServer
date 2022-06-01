const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	address: {type: String, required: false},
	password: {type: String, required: true},
	imageUri: {type: String, required: false},
	address: {type: AddressSchema, required: false},
});

const AddressSchema = new mongoose.Schema({
	houseNo: {type: String, required: true},
	street: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	pincode: {type: String, required: true},
});

const model = mongoose.model("Users", UsersSchema);

module.exports = model;
