const express = require("express");
const Controller = require("controllers/cash");
const cash = require("validation/seller/cash");

const api = express.Router();


// api.use(cash);

api.post("/", Controller.Add);
api.get("/", Controller.Get);
api.get("/repayment/:id/:ticket", Controller.GetRepayment);
api.patch("/repayment/:id/:ticket", Controller.patchRepayment);
api.put("/:id", Controller.Update);
api.patch("/:id", Controller.Update);
api.patch("/output/:id", Controller.Output);
api.delete("/:id", Controller.Delete);
api.get("/:id", Controller.Find);
api.get("/inputCash/:id", Controller.InputCash);

module.exports = api;