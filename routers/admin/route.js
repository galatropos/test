const express = require("express");
const route = require("controllers/route")

const api = express.Router();




api.get("/", route.GetRouteDefault);







module.exports = api;