const express = require("express");
const Controller = require("controllers/onlineShiping");
// const validation = require("validation/seller/validation");

const api = express.Router();


// api.use(validation)

api.get("/", Controller.Get);
api.get("/:id", Controller.Find);
api.post("/:type", Controller.Add);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);


module.exports = api;