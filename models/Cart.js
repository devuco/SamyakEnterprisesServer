const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
	products: [{product: {type: mongoose.Schema.Types.ObjectId, ref: "Products"}, quantity: {type: Number, required: true}, total: {type: Number, required: false}}],
});

const model = mongoose.model("Cart", cartSchema);

module.exports = model;
