const validation = require("services/validation");
const Models = require("models/rol");
const { CatchError } = require("services/catchError");
const mongoose = require("mongoose");





async function rol(req, res, next) {



    try {

        ////////////////////////////
        {

            const { _id } = req.body
            const id = req.url.substring(1)
            if ((id && _id) && (id !== _id))
                throw { code: 403, message: `Datos modificado por terceros` }
            if (_id) {
                if (!mongoose.isValidObjectId(_id)) throw { code: 404, message: `Usuario no encontrado ` }

                const get = await Models.findOne({ _id: _id })
                if (get) {
                    if (get.business.toString() !== req.user.business.toString()) throw { code: 403, message: `No tienes permiso para modificar el rol ` }

                }
                else throw { code: 404, message: `No hay rol ` }

            }
            if (id) {
                if (!mongoose.isValidObjectId(id)) throw { code: 404, message: `Usuario no encontrado ` }

                const get = await Models.findOne({ _id: id })
                if (get) {
                    if (get.business.toString() !== req.user.business.toString()) throw { code: 403, message: `No tienes permiso para modificar el rol ` }

                }
                else throw { code: 404, message: `No hay rol ` }
            }
        }
        /////////////////////////////////////7
        const validate = validation(
            {
                name: {
                    type: "string",
                    require: true,
                },
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


module.exports = rol;
