const express = require("express");
const validation = require("services/validation");
const { CatchError } = require("services/catchError");


const api = express.Router();

async function cash(req, res, next) {
    const { business, establishment, _id } = req.user


    try {
        if (establishment) {
            req.validate = {
                name: ["string", true],
                ip: ["string", true],
                open: ["date", false]
            }
            api.use(validation)
            next()

        }

        else throw { code: 403, message: `Este usuario no esta asignado a ninguna sucursal.` }



    } catch (error) {
        CatchError(res, error)
    }




}


module.exports = cash;
