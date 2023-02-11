const express = require("express");
const Controller = require("controllers/provider");
const provider = require("validation/seller/provider");

const api = express.Router();

api.use(provider)

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);


module.exports = api;