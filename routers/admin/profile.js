const express = require("express");
const ControllerUser = require("controllers/user")
const ControllerBusiness = require("controllers/business")

const api = express.Router();




api.get("/business/:id", ControllerBusiness.Find);
api.patch("/business/:id", ControllerBusiness.Update);
api.get("/profile/:id", ControllerUser.FindUserMaster);
api.patch("/profile/:id", ControllerUser.UpdateSeller);







module.exports = api;