const express = require("express");
const UserController = require("controllers/user")


const api = express.Router();

api.post("/", UserController.SingIn);

module.exports = api;