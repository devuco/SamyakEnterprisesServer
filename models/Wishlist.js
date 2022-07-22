var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const WishlistSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);
const model = mongoose.model("Wishlist", WishlistSchema);

module.exports = model;
