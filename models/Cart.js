const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
	products: [{type: mongoose.Schema.Types.ObjectId, ref: "Products", quantity: {type: Number, required: true}, price: {type: Number, required: true}}],
});
