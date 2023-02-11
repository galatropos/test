const express = require("express");
const Controller = require("controllers/establishment");
const admin = require("middleware/admin");

const api = express.Router();


api.use(admin)

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);

module.exports = api;