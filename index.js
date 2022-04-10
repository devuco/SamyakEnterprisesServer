const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const userRouter = require("./routers/UserRouter");
const categoryRouter = require("./routers/CategoryRouter");
const productRouter = require("./routers/ProductRouter");
const companyRouter = require("./routers/CompanyRouter");
const tokenRouter = require("./routers/TokenRouter");
require("dotenv").config({path: "./.env"});

const app = express();

mongoose.connect(
	"mongodb+srv://devuco:agrawalsamyak@cluster0.khb5j.mongodb.net/SamyakEnterprises?authSource=admin&replicaSet=atlas-jcwlj3-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
);
const connection = mongoose.connection;

connection.on("open", () => {
	console.log("connected");
});

app.get("/", (req, res) => {
	res.send("Imran Seth");
});
app.use("/products", express.static("public/uploads/images/products"));
app.use("/categories", express.static("public/uploads/images/categories"));
app.use("/company", express.static("public/uploads/images/company"));
app.use(express.json());
app.use("/users", userRouter);
app.use("/token", tokenRouter);
app.use(auth);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/company", companyRouter);

app.listen(process.env.PORT, () => {
	console.log("listening");
});
