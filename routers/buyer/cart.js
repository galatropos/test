const express = require("express");
const Controller = require("controllers/productsCustom")

// const user = require("validation/admin/user");
const api = express.Router();



// api.use(user);

api.get("/find", Controller.FindCart);
api.patch("/:id", Controller.AddCarts);
api.post("/", Controller.SelectCarts);
api.delete("/:products", Controller.DeleteCarts);







module.exports = api;