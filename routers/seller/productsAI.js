const express = require("express");
const Controller = require("controllers/productsAI");

const api = express.Router();



api.get("/", Controller.Get);
api.get("/sell", Controller.GetSell);


module.exports = api;