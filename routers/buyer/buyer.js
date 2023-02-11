const express = require("express");
const middleware = require("middleware/buyer");
const cart = require("./cart")
const address = require("./address");
const outputOnline = require("./outputOnline");

const app = express.Router();
app.use(middleware)

app.use("/cart", cart);
app.use("/address", address);
app.use("/outputOnline", outputOnline);


module.exports = app;