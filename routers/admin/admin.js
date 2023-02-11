const express = require("express");
const users = require("./user");
const rol = require("./rol");
const route = require("./route");
const establishment = require("./establishment");
const profile = require("./profile");
const admin = require("middleware/admin");
const address = require("./address")
const app = express.Router();
app.use(admin)

app.use("/users", users);
app.use("/rol", rol);
app.use("/route", route);
app.use("/establishment", establishment);
app.use("/profile", profile);
app.use("/address", address);


module.exports = app;