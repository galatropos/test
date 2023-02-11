
const Models = require("models/outputOnline");
const ModelsOnline = require("models/online");
const ModelsAddress = require("models/address");
const ModelsWord = require("models/word");
const ModelEstablishment = require("models/establishment");
const ModelsOnlineShipping = require("models/onlineShiping");
const { CatchError } = require("services/catchError");
const moment = require("moment");
const { convertLatLng } = require("../services/convertLatLng");

const ObjectId = require('mongoose').Types.ObjectId;





async function Add(req, res) {
    try {

        let word = await ModelsWord.aggregate([
            { $match: { $expr: { $lt: [0.5, { $rand: {} }] } } },
            {
                $group: {
                    _id: "$name",
                }
            }

        ]);
        word = word[0]._id
        console.log(word);

        // Models.find()
        //     .then((stored) => {
        //         res.status(200).send(stored)
        //     })
        //     .catch((error) => {
        //         CatchError(res, error);
        //     })




        const { body } = req;
        const { payment, logistic } = body;
        const ticket = ObjectId();
        const purchase = moment().format();
        let order = Object.keys(body.order);
        order = order.map(order => ObjectId(order));
        const online = await ModelsOnline.aggregate([

            { $match: { _id: { $in: order } } },
            { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products', }, },
            { $unwind: { path: "$products", "preserveNullAndEmptyArrays": true } },
        ])

        const addressBuyer = await ModelsAddress.findById(body.address)
        const addressShipping = await ModelsOnlineShipping.findById(body.addressLogistic)
        const addressLogistic = await ModelsAddress.findById(addressShipping.address)
        // console.log(addressLogistic);
        priceShipping = convertLatLng(addressBuyer, addressLogistic) * addressShipping.price
        Model = new Models;

        let get = online.map(async element => {
            return (
                ModelEstablishment.findById(element.establishment)
                    .then((res) => {
                        return ({
                            product: element.product,
                            addressSeller: res.address,
                            addressBuyer: addressBuyer._id,
                            addressLogistic,
                            establishment: element.establishment,
                            order: element._id,
                            orderShipping: addressShipping._id,
                            business: element.business,
                            logistic: addressShipping.user,
                            payment: payment,
                            quantity: body.order[element._id],
                            price: element.price,
                            priceShipping,
                            cb: element.products.cb,
                            name: element.products.name,
                            description: element.products.description,
                            buyer: req.user._id,
                            purchase,
                            ticket,
                            word
                        }
                        )
                    }
                    )
            );
            // post.push(await postNew)

            // return (post)
            // console.log(post);

        });
        get = await Promise.all(get);
        // console.log(get);
        // console.log(await get);
        console.log(Models.insertMany(await Promise.all(get)));
        // console.log(await Promise.all(post));
        // console.log(body);

        // const collection = await Models.findOne({ "business": business, "name": Model.name, deleted_at: null })

        // if (collection) throw { code: 404, message: `Ya existe la marca ${Model.name}` }

        // const collection1 = await Model.save()
        // if (collection1) res.status(200).send({ collection1 })
        // else throw ({ collection1 })
        // throw ({ message: "hola" })
        res.status(200).send({ message: "hola" })



    }
    catch (error) {
        console.log(error);
        CatchError(res, error);

    }



}

async function Get(req, res) {
    try {
        const match = {}
        switch (req.type) {
            case "logistic":
                match.logistic = req.user._id
                break
            case "buyer":
                match.buyer = req.user._id
                break;
            case "seller":
                match.establishment = req.user.establishment
                break;
            default:
                break;
        }

        const get = await Models.aggregate([
            { $match: { deleted_at: null, finish_at: null, finish_at: null, ...match } },

            // { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            // { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'businesses', localField: 'establishment.business', foreignField: '_id', as: 'establishment.business', }, },
            { $unwind: { path: "$establishment.business", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'establishment.address', foreignField: '_id', as: 'establishment.address', }, },
            { $unwind: { path: "$establishment.address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'logistic', foreignField: '_id', as: 'logistic', }, },
            { $unwind: { path: "$logistic", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer', }, },
            { $unwind: { path: "$buyer", "preserveNullAndEmptyArrays": true } },


            { $lookup: { from: 'addresses', localField: 'addressBuyer', foreignField: '_id', as: 'addressBuyer', }, },
            { $unwind: { path: "$addressBuyer", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'addressLogistic', foreignField: '_id', as: 'addressLogistic', }, },
            { $unwind: { path: "$addressLogistic", "preserveNullAndEmptyArrays": true } },

            {
                $project: {
                    _id: "$_id",
                    order: "$order",
                    name: "$name",
                    cb: "$cb",
                    quantity: "$quantity",
                    price: { $convert: { input: "$price", to: "double" } },
                    priceT: { $multiply: [{ $convert: { input: "$price", to: "double" } }, "$quantity"] },
                    priceShipping: { $convert: { input: "$priceShipping", to: "double" } },
                    total: {
                        $sum: [
                            {
                                $multiply:
                                    [
                                        { $convert: { input: "$price", to: "double" } },
                                        "$quantity"
                                    ]
                            },
                            { $convert: { input: "$priceShipping", to: "double" } }]
                    },
                    seller: {
                        nameBusiness: "$establishment.business.name",
                        nameEstablishment: "$establishment.name",
                        state: "$establishment.address.state",
                        municipality: "$establishment.address.municipality",
                        locality: "$establishment.address.locality",
                        address: "$establishment.address.address",
                        ZIP: "$establishment.address.ZIP",
                        lat: { $toDouble: "$establishment.address.lat" },
                        lng: { $toDouble: "$establishment.address.lng" },

                    },


                    // logistic: "$logistic",
                    logistic: {
                        name: "$logistic.name",
                        lastname: "$logistic.lastname",
                        phone: "$logistic.phone",
                        state: "$addressLogistic.state",
                        municipality: "$addressLogistic.municipality",
                        locality: "$addressLogistic.locality",
                        address: "$addressLogistic.address",
                        ZIP: "$addressLogistic.ZIP",
                        lat: { $toDouble: "$addressLogistic.lat" },
                        lng: { $toDouble: "$addressLogistic.lng" },
                    },
                    buyer: {
                        name: "$buyer.name",
                        lastname: "$buyer.lastname",
                        phone: "$buyer.phone",
                        state: "$addressBuyer.state",
                        municipality: "$addressBuyer.municipality",
                        locality: "$addressBuyer.locality",
                        address: "$addressBuyer.address",
                        ZIP: "$addressBuyer.ZIP",
                        lat: { $toDouble: "$addressBuyer.lat" },
                        lng: { $toDouble: "$addressBuyer.lng" },
                    },
                    accept_seller: "$accept_seller",
                    accept_logistic: "$accept_logistic",

                }
            }
        ]);
        if (!get) throw { code: 403, message: `No hay compras..` };
        res.status(200).send(get);
    } catch (error) {
        console.log(error);
        CatchError(res, error);
    }





}

async function GetAccept(req, res) {
    try {
        console.log("object");
        const match = {}
        switch (req.type) {
            case "logistic":
                match.logistic = req.user._id
                break
            case "buyer":
                match.buyer = req.user._id
                break;
            case "seller":
                match.establishment = req.user.establishment
                break;
            default:
                break;
        }

        const get = await Models.aggregate([
            { $match: { finish_at: { $ne: null }, ...match } },

            // { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            // { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'businesses', localField: 'establishment.business', foreignField: '_id', as: 'establishment.business', }, },
            { $unwind: { path: "$establishment.business", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'establishment.address', foreignField: '_id', as: 'establishment.address', }, },
            { $unwind: { path: "$establishment.address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'logistic', foreignField: '_id', as: 'logistic', }, },
            { $unwind: { path: "$logistic", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer', }, },
            { $unwind: { path: "$buyer", "preserveNullAndEmptyArrays": true } },


            { $lookup: { from: 'addresses', localField: 'addressBuyer', foreignField: '_id', as: 'addressBuyer', }, },
            { $unwind: { path: "$addressBuyer", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'addressLogistic', foreignField: '_id', as: 'addressLogistic', }, },
            { $unwind: { path: "$addressLogistic", "preserveNullAndEmptyArrays": true } },

            {
                $project: {
                    _id: "$_id",
                    order: "$order",
                    name: "$name",
                    cb: "$cb",
                    quantity: "$quantity",
                    price: { $convert: { input: "$price", to: "double" } },
                    priceT: { $multiply: [{ $convert: { input: "$price", to: "double" } }, "$quantity"] },
                    priceShipping: { $convert: { input: "$priceShipping", to: "double" } },
                    total: {
                        $sum: [
                            {
                                $multiply:
                                    [
                                        { $convert: { input: "$price", to: "double" } },
                                        "$quantity"
                                    ]
                            },
                            { $convert: { input: "$priceShipping", to: "double" } }]
                    },
                    seller: {
                        nameBusiness: "$establishment.business.name",
                        nameEstablishment: "$establishment.name",
                        state: "$establishment.address.state",
                        municipality: "$establishment.address.municipality",
                        locality: "$establishment.address.locality",
                        address: "$establishment.address.address",
                        ZIP: "$establishment.address.ZIP",
                        lat: { $toDouble: "$establishment.address.lat" },
                        lng: { $toDouble: "$establishment.address.lng" },

                    },


                    // logistic: "$logistic",
                    logistic: {
                        name: "$logistic.name",
                        lastname: "$logistic.lastname",
                        phone: "$logistic.phone",
                        state: "$addressLogistic.state",
                        municipality: "$addressLogistic.municipality",
                        locality: "$addressLogistic.locality",
                        address: "$addressLogistic.address",
                        ZIP: "$addressLogistic.ZIP",
                        lat: { $toDouble: "$addressLogistic.lat" },
                        lng: { $toDouble: "$addressLogistic.lng" },
                    },
                    buyer: {
                        name: "$buyer.name",
                        lastname: "$buyer.lastname",
                        phone: "$buyer.phone",
                        state: "$addressBuyer.state",
                        municipality: "$addressBuyer.municipality",
                        locality: "$addressBuyer.locality",
                        address: "$addressBuyer.address",
                        ZIP: "$addressBuyer.ZIP",
                        lat: { $toDouble: "$addressBuyer.lat" },
                        lng: { $toDouble: "$addressBuyer.lng" },
                    },
                    accept_seller: "$accept_seller",
                    accept_logistic: "$accept_logistic",

                }
            }
        ]);
        if (!get) throw { code: 403, message: `No hay compras..` };
        res.status(200).send(get);
    } catch (error) {
        console.log(error);
        CatchError(res, error);
    }





}


async function Cancel(req, res) {
    try {
        const match = {}
        switch (req.type) {
            case "buyer":
                match.buyer = req.user._id
                break
            case "logistic":
                match.logistic = req.user._id
                break;
            case "seller":
                match.establishment = req.user.establishment
                break;
            default:
                break;
        }
        const get = await Models.aggregate([
            { $match: { deleted_at: { $ne: null }, ...match } },

            // { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            // { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'businesses', localField: 'establishment.business', foreignField: '_id', as: 'establishment.business', }, },
            { $unwind: { path: "$establishment.business", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'establishment.address', foreignField: '_id', as: 'establishment.address', }, },
            { $unwind: { path: "$establishment.address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'logistic', foreignField: '_id', as: 'logistic', }, },
            { $unwind: { path: "$logistic", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer', }, },
            { $unwind: { path: "$buyer", "preserveNullAndEmptyArrays": true } },


            { $lookup: { from: 'addresses', localField: 'addressBuyer', foreignField: '_id', as: 'addressBuyer', }, },
            { $unwind: { path: "$addressBuyer", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'addressLogistic', foreignField: '_id', as: 'addressLogistic', }, },
            { $unwind: { path: "$addressLogistic", "preserveNullAndEmptyArrays": true } },

            {
                $project: {
                    _id: "$_id",
                    order: "$order",
                    name: "$name",
                    cb: "$cb",
                    quantity: "$quantity",
                    price: { $convert: { input: "$price", to: "double" } },
                    priceT: { $multiply: [{ $convert: { input: "$price", to: "double" } }, "$quantity"] },
                    priceShipping: { $convert: { input: "$priceShipping", to: "double" } },
                    total: {
                        $sum: [
                            {
                                $multiply:
                                    [
                                        { $convert: { input: "$price", to: "double" } },
                                        "$quantity"
                                    ]
                            },
                            { $convert: { input: "$priceShipping", to: "double" } }]
                    },
                    seller: {
                        nameBusiness: "$establishment.business.name",
                        nameEstablishment: "$establishment.name",
                        state: "$establishment.address.state",
                        municipality: "$establishment.address.municipality",
                        locality: "$establishment.address.locality",
                        address: "$establishment.address.address",
                        ZIP: "$establishment.address.ZIP",
                        lat: { $toDouble: "$establishment.address.lat" },
                        lng: { $toDouble: "$establishment.address.lng" },

                    },


                    // logistic: "$logistic",
                    logistic: {
                        name: "$logistic.name",
                        lastname: "$logistic.lastname",
                        phone: "$logistic.phone",
                        state: "$addressLogistic.state",
                        municipality: "$addressLogistic.municipality",
                        locality: "$addressLogistic.locality",
                        address: "$addressLogistic.address",
                        ZIP: "$addressLogistic.ZIP",
                        lat: { $toDouble: "$addressLogistic.lat" },
                        lng: { $toDouble: "$addressLogistic.lng" },
                    },
                    buyer: {
                        name: "$buyer.name",
                        lastname: "$buyer.lastname",
                        phone: "$buyer.phone",
                        state: "$addressBuyer.state",
                        municipality: "$addressBuyer.municipality",
                        locality: "$addressBuyer.locality",
                        address: "$addressBuyer.address",
                        ZIP: "$addressBuyer.ZIP",
                        lat: { $toDouble: "$addressBuyer.lat" },
                        lng: { $toDouble: "$addressBuyer.lng" },
                    },
                    deleted_type: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$deleted_type", "buyer"] }, then: "Comprador" },
                                { case: { $eq: ["$deleted_type", "seller"] }, then: "vendedor" },
                                { case: { $eq: ["$deleted_type", "logistic"] }, then: "logistica" },
                            ],
                            default: "otros"

                        }
                    },
                }
            }
        ]);
        if (!get) throw { code: 403, message: `No hay compras..` };
        res.status(200).send(get);
    } catch (error) {
        console.log(error);
        CatchError(res, error);
    }





}


async function Find(req, res) {

    try {
        const _id = ObjectId(req.params)

        const get = await Models.aggregate([
            { $match: { _id } },

            // { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            // { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
            { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'businesses', localField: 'establishment.business', foreignField: '_id', as: 'establishment.business', }, },
            { $unwind: { path: "$establishment.business", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'establishment.address', foreignField: '_id', as: 'establishment.address', }, },
            { $unwind: { path: "$establishment.address", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'logistic', foreignField: '_id', as: 'logistic', }, },
            { $unwind: { path: "$logistic", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer', }, },
            { $unwind: { path: "$buyer", "preserveNullAndEmptyArrays": true } },


            { $lookup: { from: 'addresses', localField: 'addressBuyer', foreignField: '_id', as: 'addressBuyer', }, },
            { $unwind: { path: "$addressBuyer", "preserveNullAndEmptyArrays": true } },

            { $lookup: { from: 'addresses', localField: 'addressLogistic', foreignField: '_id', as: 'addressLogistic', }, },
            { $unwind: { path: "$addressLogistic", "preserveNullAndEmptyArrays": true } },

            {
                $project: {
                    _id: "$_id",
                    order: "$order",
                    name: "$name",
                    word: "$word",
                    cb: "$cb",
                    quantity: "$quantity",
                    price: { $convert: { input: "$price", to: "double" } },
                    priceT: { $multiply: [{ $convert: { input: "$price", to: "double" } }, "$quantity"] },
                    priceShipping: { $convert: { input: "$priceShipping", to: "double" } },
                    total: {
                        $sum: [
                            {
                                $multiply:
                                    [
                                        { $convert: { input: "$price", to: "double" } },
                                        "$quantity"
                                    ]
                            },
                            { $convert: { input: "$priceShipping", to: "double" } }]
                    },
                    seller: {
                        nameBusiness: "$establishment.business.name",
                        nameEstablishment: "$establishment.name",
                        state: "$establishment.address.state",
                        municipality: "$establishment.address.municipality",
                        locality: "$establishment.address.locality",
                        address: "$establishment.address.address",
                        ZIP: "$establishment.address.ZIP",
                        lat: { $toDouble: "$establishment.address.lat" },
                        lng: { $toDouble: "$establishment.address.lng" },

                    },


                    // logistic: "$logistic",
                    logistic: {
                        name: "$logistic.name",
                        lastname: "$logistic.lastname",
                        phone: "$logistic.phone",
                        state: "$addressLogistic.state",
                        municipality: "$addressLogistic.municipality",
                        locality: "$addressLogistic.locality",
                        address: "$addressLogistic.address",
                        ZIP: "$addressLogistic.ZIP",
                        lat: { $toDouble: "$addressLogistic.lat" },
                        lng: { $toDouble: "$addressLogistic.lng" },
                    },
                    buyer: {
                        name: "$buyer.name",
                        lastname: "$buyer.lastname",
                        phone: "$buyer.phone",
                        state: "$addressBuyer.state",
                        municipality: "$addressBuyer.municipality",
                        locality: "$addressBuyer.locality",
                        address: "$addressBuyer.address",
                        ZIP: "$addressBuyer.ZIP",
                        lat: { $toDouble: "$addressBuyer.lat" },
                        lng: { $toDouble: "$addressBuyer.lng" },
                    },

                    accept_seller: "$accept_seller",
                    accept_logistic: "$accept_logistic",
                }
            }
        ]);
        if (!get) throw { code: 403, message: `No hay compras..` };
        res.status(200).send(get[0]);
    } catch (error) {
        console.log(error);
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { _id, name } = req.body
    const { business } = req.user;
    try {
        const find = await Models.findOne({ "_id": { $ne: _id }, "business": business, name: name, deleted_at: null });


        if (find) throw { code: 404, message: `Ya existe la marca ${name} ` }

        const stored = await Models.findByIdAndUpdate(_id, req.body);
        if (!stored) throw { code: 404, message: `No se pudo actualizar` }

        res.status(200).send({ old: req.body, new: stored })


    }

    catch (error) {
        console.log(error)
        CatchError(res, error)

    }



}




async function Delete(req, res) {

    try {
        const { type: deleted_type } = req;
        const deleted_at = moment().format();
        const { id } = req.params

        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "No existe el producto." }


        const deleteOrder = await Models.findByIdAndUpdate(id, { deleted_at, deleted_type })
        if (!deleteOrder) throw { code: 404, message: "No se pudo eliminar." }

        res.status(200).send({ message: "Producto cancelado." });

    } catch (error) {

        CatchError(res, error)

    }


}

async function Accept(req, res) {
    try {
        const { type } = req;
        const { id } = req.body
        const pedido = []
        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "No existe el producto." }

        switch (type) {
            case "seller":
                pedido.accept_seller = moment().format();;
                break;
            case "logistic":
                pedido.accept_logistic = moment().format();;
            default:
                break;
        }



        const accept = await Models.findByIdAndUpdate(id, { ...pedido })
        if (!accept) throw { code: 404, message: "No se pudo levantar el pedido." }

        res.status(200).send({ message: "Producto levantado." });


    } catch (error) {
        CatchError(res, error)
    }
}


async function Finish(req, res) {
    try {
        const { id, word, recive } = req.body
        const finish_at = moment().format();
        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "No existe el producto." }
        if (collection.word.toUpperCase() !== word.toUpperCase()) throw { code: 404, stored: { word: "palabra incorrecta." } }

        const accept = await Models.findByIdAndUpdate(id, { finish_at, recive })
        if (!accept) throw { code: 404, message: "No se pudo entregar el pedido." }

        res.status(200).send({ message: "Producto entregado." });

        console.log(word.toUpperCase());

    } catch (error) {
        CatchError(res, error)
    }
}
module.exports = {
    Add, Get, Update, Delete, Find, Cancel, Accept, Finish, GetAccept
};