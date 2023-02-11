const express = require("express");
const middleware = require("middleware/logistic");
// const cart = require("./cart")
const address = require("./address")
const shipping = require("./shipping")
const online = require("./online")
const outputOnline = require("./outputOnline")

const app = express.Router();
app.use(middleware)

app.use("/address", address);
app.use("/shipping", shipping);
app.use("/online", online);
app.use("/outputOnline", outputOnline);

module.exports = app;