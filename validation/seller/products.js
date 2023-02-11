const validation = require("services/validation");
const Models = require("models/products");
const { CatchError } = require("services/catchError");
const mongoose = require("mongoose");





async function products(req, res, next) {
    try {
        async function condition(id) {
            try {
                if (id) {
                    if (!mongoose.isValidObjectId(id)) throw { code: 404, message: `marca no encontrado ` }

                    const get = await Models.findOne({ _id: id })
                    if (get) {
                        if (get.business.toString() !== req.user.business.toString()) return { code: 403, message: `No tienes permiso para modificar el producto ` }
                    }
                    else return { code: 404, message: `No se encontro el producto` }
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

        if (await condition(_id)) throw await condition(_id)
        if (await condition(id)) throw await condition(id)

        const validate = validation(
            {
                name: { type: "String", require: true, },
                cb: { type: "String", require: true, },
                business: { type: "object_id", require: true, },
                brand: { type: "object_id", require: true, },
                provider: { type: "object_id", require: true, },
                price: { type: "number", require: true, },
                description: { type: "String", require: true, },
                category: { type: "repeat", repeat: "subcategory", require: true, },
                subcategory: { type: "array&object_id", require: true, },
                model: { type: "String", require: true, },
                features: { type: "String", require: true, },
            },
            req.body)
        if (validate)
            throw { code: "validate", stored: newValidation }

        next()


    } catch (error) {
        CatchError(res, error)
    }




}


module.exports = products;
