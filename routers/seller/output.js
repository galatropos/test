const express = require("express");
const Controller = require("controllers/output");

const api = express.Router();



api.get("/", Controller.Get);


module.exports = api;