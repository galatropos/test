const express = require("express");
const Controller = require("controllers/brand");
const brand = require("validation/seller/brand");

const api = express.Router();


api.use(brand)

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);


module.exports = api;