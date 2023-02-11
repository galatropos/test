const express = require("express");
const Controller = require("controllers/user")
const api = express.Router();




api.get("/:id", Controller.FindUserMaster);
api.patch("/profile/:id", Controller.UpdateSeller);


module.exports = api;