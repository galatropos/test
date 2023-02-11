
const Models = require("../models/online");
const { CatchError } = require("../services/catchError");
const ObjectId = require('mongoose').Types.ObjectId;

async function Get(req, res) {
    try {

        const { establishment, business } = req.user
        const get = await Models.aggregate([

            { $match: { business, establishment } },
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product', }, },
            { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },
            {
                $project: {
                    _id: "$_id",
                    product: "$product",
                    price: { $convert: { input: "$price", to: "double" } },
                    shipping: "$shipping",

                }
            }

        ])
        if (!get) throw { code: 404, message: `No hay datos.` }

        res.status(200).send(get)

    } catch (error) {
        CatchError(res, error)

    }
}

async function Add(req, res) {
    try {

        const { establishment, _id, business } = req.user
        const type = Number(req.params.type)
        if (type !== 0 && type !== 1)
            throw { code: 404, message: `Error no se reconocio el tipo.` }
        const online = new Models({ ...req.body, establishment, business, type })

        const get = await Models.aggregate([
            { $match: { business, establishment, product: online.product, type: 0 } },
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product', }, },
            { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },
        ])
        if (get.length !== 0)
            throw { code: 404, message: `Ya existe el tipo.` }

        const post = await online.save()
        if (!post)
            throw { code: 404, message: `Error no se pudo añadir.` }
        res.status(200).send(post)
    } catch (error) {
        CatchError(res, error)

    }
}


async function Find(req, res) {
    try {

        const _id = ObjectId(req.params.id);


        const get = await Models.aggregate([

            { $match: { _id } },
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product', }, },
            { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },
            {
                $project: {
                    _id: "$_id",
                    product: {
                        _id: "$product._id",
                        name: "$product.name",
                        price: { $convert: { input: "$product.price", to: "double" } },
                        brand: "$product.brand",
                        business: "$product.business",
                        category: "$product.category",
                        cb: "$product.cb",
                        created_at: "$product.created_at",
                        deleted_at: "$product.deleted_at",
                        description: "$product.description",
                        features: "$product.features",
                        image: "$product.image",
                        model: "$product.model",
                        provider: "$product.provider",

                    },
                    price: { $convert: { input: "$price", to: "double" } },
                    shipping: "$shipping",

                }
            }

        ])
        if (!get) throw { code: 404, message: `No hay datos.` }

        res.status(200).send(get[0])

    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }
}

async function Update(req, res) {
    const { body, params } = req
    const { id } = params;
    try {

        const update = await Models.findByIdAndUpdate(id, body);

        if (!update) throw { code: 404, message: `No se pudo eliminar.` }
        res.status(200).send(update)

    } catch (error) {
        CatchError(res, error)

    }
}

async function Delete(req, res) {
    try {
        const { id } = req.params;
        const deletes = await Models.findByIdAndDelete(id)
        if (!deletes) throw { code: 404, message: `No se pudo eliminar.` }
        res.status(200).send(deletes)

    } catch (error) {

        CatchError(res, error)

    }
}





module.exports = {
    Add, Get, Update, Delete, Find
};



