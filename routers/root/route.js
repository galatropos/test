const express = require("express");
const RouteController = require("../../controllers/route");

const api = express.Router();



api.get("/:type", RouteController.GetRoute);
api.get("/backup/:type", RouteController.backup);
api.get("/restore/:type", RouteController.restore);
api.get("/:type/:id", RouteController.findCut);
api.delete("/:type/:id", RouteController.deleteRoute);
api.patch("/add/:id/:type", RouteController.add);
api.patch("/sort/:type", RouteController.sort);
api.patch("/:type/:id", RouteController.update);


module.exports = api;