const express = require("express");
const Controller = require("controllers/shipping")

// const user = require("validation/admin/user");
const api = express.Router();



// api.use(user);

api.get("/", Controller.Get);
api.post("/", Controller.Add);
api.get("/:id", Controller.Find);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);







module.exports = api;