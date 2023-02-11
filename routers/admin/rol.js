const express = require("express");
const RolController = require("controllers/rol");
const rol = require("validation/admin/rol");

const api = express.Router();



api.use(rol);

api.post("/", RolController.AddRol);
api.get("/", RolController.GetRol);
api.get("/:id", RolController.FindRol);
api.patch("/:id", RolController.UpdateRol);
api.delete("/:id", RolController.DeleteRol);


module.exports = api;