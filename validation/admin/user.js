const express = require("express");
const validation = require("services/validation");
const Models = require("models/user");
const { CatchError } = require("services/catchError");
const mongoose = require("mongoose");



const api = express.Router();

async function user(req, res, next) {
    try {

        {

            const { _id } = req.body
            const id = req.url.substring(1)

            if ((id && _id) && (id !== _id))
                throw { code: 403, message: `Datos modificado por terceros` }
            if (_id) {
                if (!mongoose.isValidObjectId(_id)) throw { code: 404, message: `Usuario no encontrado ` }


                const get = await Models.findOne({ _id: _id })
                if (get) {
                    if (get.business.toString() !== req.user.business.toString()) throw { code: 403, message: `No tienes permiso para modificar el usuario ` }

                }
                else throw { code: 404, message: `Usuario no encontrado ` }

            }
            if (id) {
                if (!mongoose.isValidObjectId(id)) throw { code: 404, message: `Usuario no encontrado ` }

                const get = await Models.findOne({ _id: id })

                if (get) {
                    if (get.business.toString() !== req.user.business.toString()) throw { code: 403, message: `No tienes permiso para modificar el usuario ` }

                }
                else throw { code: 404, message: `Usuario no encontrado ` }
            }
        }


        const validate = validation(
            {
                name: {
                    type: "string",
                    require: true,
                },
                lastname: {
                    type: "string",
                    require: true,
                },
                email: {
                    type: "string",
                    require: true,
                },
                establishment: {
                    type: "object_id",
                    require: true,
                },
                rol: {
                    type: "object_id",
                    require: true,
                },
                password: {
                    type: "string",
                    require: true,
                },
                repeatPassword: {
                    type: "repeat",
                    repeat: "password"

                }
            },
            req.body)
        if (validate)
            throw { code: "validate", stored: newValidation }
        else
            next()







    } catch (error) {
        CatchError(res, error)
    }




}


module.exports = user;
