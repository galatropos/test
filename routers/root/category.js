const express = require("express");
const Controller = require("controllers/category");
const category = require("validation/root/category");

const api = express.Router();

api.use(category)

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);


module.exports = api;