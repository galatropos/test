const express = require("express");
const controller = require("controllers/productsHome");
const Products = require("controllers/products");
const Category = require("controllers/category");

const api = express.Router();



api.get("/", controller.Get);
api.get("/one/:id", controller.FindOne);
api.get("/category/:id", controller.ProductsByCategory);
api.get("/cart/:id", controller.ProductsByCart);
api.get("/establishment/:id", controller.ProductsByEstablishment);
api.get("/category", Category.Get);



module.exports = api;