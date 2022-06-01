const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
	houseNo: {type: String, required: true},
	street: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	pincode: {type: String, required: true},
});

const UsersSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	imageUri: {type: String, required: false, default: ""},
	address: {type: AddressSchema, required: false, default: null},
});

const model = mongoose.model("Users", UsersSchema);

module.exports = model;
