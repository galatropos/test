const express = require("express");
const Controller = require("controllers/outputOnline")

// const user = require("validation/admin/user");
const api = express.Router();



// api.use(user);

api.get("/cancel", Controller.Cancel);
api.patch("/accept", Controller.Accept);
api.get("/finish", Controller.GetAccept);
api.get("/", Controller.Get);
api.post("/", Controller.Add);
api.get("/:id", Controller.Find);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);







module.exports = api;