const express = require("express");
const Controller = require("controllers/products");
const products = require("validation/seller/products");

const api = express.Router();


api.use(products)

api.get("/", Controller.Get);
api.get("/:id", Controller.Find);
api.post("/", Controller.Add);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);


module.exports = api;