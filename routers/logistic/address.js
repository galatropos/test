const express = require("express");
const Controller = require("controllers/address")

// const user = require("validation/admin/user");
const api = express.Router();



// api.use(user);

api.get("/", Controller.Get);
api.post("/", Controller.Add);
api.get("/:id", Controller.Find);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Deletes);







module.exports = api;