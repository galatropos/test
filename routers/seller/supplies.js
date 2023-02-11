const express = require("express");
const Controller = require("controllers/supplies");
const supplies = require("validation/seller/supplies");

const api = express.Router();



api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.get("/view", Controller.View);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);


module.exports = api;