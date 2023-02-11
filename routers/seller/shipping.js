const express = require("express");
const Controller = require("controllers/shipping");
// const brand = require("validation/seller/brand");

const api = express.Router();


// api.use(brand)

api.get("/", Controller.Get);
api.get("/:id", Controller.Find);
api.post("/", Controller.Add);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);


module.exports = api;