const express = require("express");
const Controller = require("controllers/word");
const word = require("validation/root/word");

const api = express.Router();

api.use(word)

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.get("/random", Controller.Random);
api.patch("/:id", Controller.Update);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);


module.exports = api;