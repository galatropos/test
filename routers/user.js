const express = require("express");
const UserController = require("controllers/user")
const admin = require("middleware/admin")

const user = require("validation/admin/user");
const validation = require("services/validation");
const api = express.Router();



api.use(admin);
api.use(user);
api.use(validation);

api.post("/signup", UserController.signUp);
api.get("/getUser", UserController.GetUser);
api.post("/registration/", UserController.Registration);
api.post("/findUser/", UserController.FindUser);
api.post("/updateUser/", UserController.UpdateUser);
api.post("/deleteUser/", UserController.DeleteUser);
api.get("/profile/", UserController.Profile);







module.exports = api;