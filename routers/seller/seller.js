const express = require("express");
const seller = require("middleware/seller");
const profile = require("./profile");
const provider = require("./provider");
const brand = require("./brand");
const products = require("./products");
const supplies = require("./supplies");
const output = require("./output");
const cash = require("./cash");
const productsAI = require("./productsAI");
const online = require("./online");
const market = require("./market");
const shipping = require("./shipping");
const outputOnline = require("./outputOnline");

const app = express.Router();
app.use(seller)

app.use("/profile", profile);
app.use("/provider", provider);
app.use("/brand", brand);
app.use("/products", products);
app.use("/supplies", supplies);
app.use("/output", output);
app.use("/cash", cash);
app.use("/productsAI", productsAI);
app.use("/online", online);
app.use("/market", market);
app.use("/shipping", shipping);
app.use("/outputOnline", outputOnline);


module.exports = app;