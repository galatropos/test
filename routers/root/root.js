const express = require("express");
const route = require("./route");
const root = require("../../middleware/root");
const category = require("./category");
const word = require("./word");

const app = express.Router();
app.use(root)

app.use("/route", route);
app.use("/category", category);
app.use("/word", word);


module.exports = app;