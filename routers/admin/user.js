const express = require("express");
const Controller = require("controllers/user")

const user = require("validation/admin/user");
const api = express.Router();



api.use(user);

api.get("/", Controller.GetUserAdmin);
api.get("/:id", Controller.FindUser);
api.post("/", Controller.AddSeller);
api.patch("/:id", Controller.UpdateSeller);
api.delete("/:id", Controller.DeleteUser);







module.exports = api;