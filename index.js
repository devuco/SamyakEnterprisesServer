const express = require("express");
const mongoose = require("mongoose");
const verifyUser = require("./middleware/user");
const verifyToken = require("./middleware/auth");
const loginRouter = require("./routers/LoginRouter");
const categoryRouter = require("./routers/CategoryRouter");
const productRouter = require("./routers/ProductRouter");
const companyRouter = require("./routers/CompanyRouter");
const tokenRouter = require("./routers/TokenRouter");
const userRouter = require("./routers/UserRouter");
const cartRouter = require("./routers/CartRouter");
const checkoutRouter = require("./routers/CheckoutRouter");
require("dotenv").config({path: "./.env"});

const app = express();

mongoose.connect(
	"mongodb+srv://devuco:agrawalsamyak@cluster0.khb5j.mongodb.net/SamyakEnterprises?authSource=admin&replicaSet=atlas-jcwlj3-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
);
const connection = mongoose.connection;

connection.on("open", () => {
	console.log("connected");
});

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
	res.send("Imran Seth");
});
app.use("/products", express.static("public/uploads/images/products"));
app.use("/categories", express.static("public/uploads/images/categories"));
app.use("/company", express.static("public/uploads/images/company"));
app.use("/invoice", express.static("views"));
app.use(express.json());
app.use("/login", loginRouter);
app.use("/token", tokenRouter);
app.use(verifyToken);
app.use("/categories", categoryRouter);
app.use("/company", companyRouter);
app.use("/products", productRouter);
app.use(verifyUser);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);

app.listen(process.env.PORT, () => {
	console.log("listening");
});
