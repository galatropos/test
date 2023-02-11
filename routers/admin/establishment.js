const express = require("express");
const controllers = require("controllers/establishment");
const validation = require("validation/admin/establishment");

const api = express.Router();



api.use(validation);

api.post("/", controllers.Add);
api.get("/", controllers.Get);
api.get("/:id", controllers.Find);
api.patch("/:id", controllers.Update);
api.delete("/:id", controllers.Delete);


module.exports = api;