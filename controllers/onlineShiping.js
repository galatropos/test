
const Models = require("../models/onlineShiping");
const ModelsAddress = require("../models/address");
const { CatchError } = require("../services/catchError");
const { convertLatLng } = require("../services/convertLatLng");
const ObjectId = require('mongoose').Types.ObjectId;

async function Get(req, res) {
    try {
        const { _id: user } = req.user
        const get = await Models.aggregate([

            { $match: { user } },
            { $lookup: { from: 'addresses', localField: 'address', foreignField: '_id', as: 'address', }, },
            { $unwind: { path: "$address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'shippings', localField: 'shipping', foreignField: '_id', as: 'shipping', }, },
            { $unwind: { path: "$shipping", "preserveNullAndEmptyArrays": true } },
            {
                $project: {
                    _id: "$_id",
                    address:
                    {
                        ZIP: "$address.ZIP",
                        address: "$address.address",
                        state: "$address.state",
                        lat: { $convert: { input: "$address.lat", to: "double" } },
                        lng: { $convert: { input: "$address.lng", to: "double" } },
                        locality: "$address.locality",
                        municipality: "$address.municipality",
                        name: "$address.name",
                        numExt: "$address.numExt",
                        numInt: "$address.numInt",
                        reference: "$address.reference",
                        _id: "$address._id",
                    },
                    price: { $convert: { input: "$price", to: "double" } },
                    shipping: "$shipping",

                }
            }

        ])
        console.log(get);
        if (!get) throw { code: 404, message: `No hay datos.` }

        res.status(200).send(get)

    } catch (error) {
        CatchError(res, error)

    }
}

async function Add(req, res) {
    try {
        const { _id: user } = req.user
        const online = new Models({ ...req.body, user })
        console.log(online);

        const post = await online.save()
        if (!post)
            throw { code: 404, message: `Error no se pudo añadir.` }
        res.status(200).send(post)
        // throw { code: 404, message: `Error no se pudo añadir.` }

    } catch (error) {
        console.log(error);
        CatchError(res, error)

    }
}


async function Find(req, res) {
    try {

        const _id = ObjectId(req.params.id);
        const user = ObjectId(req.user._id);

        const get = await Models.aggregate([

            { $match: { _id, user } },
            { $lookup: { from: 'addresses', localField: 'address', foreignField: '_id', as: 'address', }, },
            { $unwind: { path: "$address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'shippings', localField: 'shipping', foreignField: '_id', as: 'shipping', }, },
            { $unwind: { path: "$shipping", "preserveNullAndEmptyArrays": true } },
            {
                $project: {
                    _id: "$_id",
                    address:
                    {
                        ZIP: "$address.ZIP",
                        address: "$address.address",
                        state: "$address.state",
                        lat: { $convert: { input: "$address.lat", to: "double" } },
                        lng: { $convert: { input: "$address.lng", to: "double" } },
                        localidad: "$address.locality",
                        municipality: "$address.municipality",
                        name: "$address.name",
                        numExt: "$address.numExt",
                        numInt: "$address.numInt",
                        reference: "$address.reference",
                        _id: "$address._id",
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




async function GetHome(req, res) {
    try {
        const { id } = req.params

        const address = await ModelsAddress.findById(id);
        let get = await Models.aggregate([

            { $match: {} },
            { $lookup: { from: 'addresses', localField: 'address', foreignField: '_id', as: 'address', }, },
            { $unwind: { path: "$address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'shippings', localField: 'shipping', foreignField: '_id', as: 'shipping', }, },
            { $unwind: { path: "$shipping", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user', }, },
            { $unwind: { path: "$user", "preserveNullAndEmptyArrays": true } },
            {
                $project: {
                    _id: "$_id",
                    address:
                    {
                        ZIP: "$address.ZIP",
                        address: "$address.address",
                        state: "$address.state",
                        lat: { $convert: { input: "$address.lat", to: "double" } },
                        lng: { $convert: { input: "$address.lng", to: "double" } },
                        locality: "$address.locality",
                        municipality: "$address.municipality",
                        name: "$address.name",
                        numExt: "$address.numExt",
                        numInt: "$address.numInt",
                        reference: "$address.reference",
                        _id: "$address._id",
                    },
                    price: { $convert: { input: "$price", to: "double" } },
                    shipping: "$shipping",
                    user: "$user"
                }
            }

        ])
        get = get.map((get) => ({ ...get, rate: convertLatLng(address, get.address) * get.price }))
        if (!get) throw { code: 404, message: `No hay datos.` }

        res.status(200).send(get)



    } catch (error) {
        console.log(error);
        CatchError(res, error)
    }
}


module.exports = {
    Add, Get, Update, Delete, Find, GetHome
};



