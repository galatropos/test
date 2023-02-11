const express = require("express")
const AuthController = require("controllers/auth")

const api = express.Router();

api.post("/refresh_access_token", AuthController.RefreshAccessToken);

module.exports = api; 
