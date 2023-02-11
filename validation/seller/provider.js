const validation = require("services/validation");
const Models = require("models/provider");
const { CatchError } = require("services/catchError");
const mongoose = require("mongoose");





async function provider(req, res, next) {
    try {
        async function condition(id) {
            try {
                if (id) {
                    if (!mongoose.isValidObjectId(id)) throw { code: 404, message: `Usuario no encontrado ` }

                    const get = await Models.findOne({ _id: id })
                    if (get) {
                        if (get.business.toString() !== req.user.business.toString()) throw { code: 403, message: `No tienes permiso para modificar el proveedor ` }
                        if (get.establishment.toString() !== req.user.establishment.toString()) throw { code: 403, message: `No tienes permiso para modificar el proveedor ` }
                    }
                    else throw { code: 404, message: `No se encontro provedor` }
                }
            }
            catch (error) {
                CatchError(res, error)

            }
        }


        const { _id } = req.body
        const id = req.url.substring(1)
        if ((id && _id) && (id !== _id))
            throw { code: 403, message: `Datos modificado por terceros` }

        await condition(_id)
        await condition(id)
        const validate = validation(
            {
                _id: { type: "object_id", require: true },
                name: { type: "string", require: true },
                lastname: { type: "string", require: true },
                businessProvider: { type: "string", require: true },
                state: { type: "string", require: true },
                municipality: { type: "string", require: true },
                location: { type: "string", require: true },
                direction: { type: "string", require: true },
                email: { type: "string", require: true },
                phone: { type: "string", require: true },
                web: { type: "string", require: true },
                reference: { type: "string", require: true },
                business: { type: "object_id", require: true },
                establishment: { type: "object_id", require: true },
            },
            req.body)
        if (validate)
            throw { code: "validate", stored: newValidation }
        next()

    } catch (error) {
        console.log(error)
        CatchError(res, error)
    }




}


module.exports = provider;
