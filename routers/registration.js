const express = require("express");
const UserController = require("controllers/user")
const registration = require("validation/home/registration");

const api = express.Router();

api.use(registration)

api.post("/", UserController.Registration);
api.post("/buyer", UserController.Buyer);
api.post("/seller", UserController.Seller);
api.post("/logistic", UserController.Logistic);

module.exports = api;