
const Models = require("../models/supplies");
const Authorization = require("../services/Authorization");
const { CatchError } = require("../services/catchError");
const moment = require("moment")








async function Add(req, res) {
    try {

        const { body } = req;
        const { products, price, quantity, expiration, description } = body;
        const business = Authorization.business(req);
        const establishment = Authorization.establishment(req);
        let stored = {};
        Model = new Models;
        Model.products = products;
        Model.price = price;
        Model.expiration = expiration
        Model.description = description;
        Model.business = business
        Model.establishment = establishment


        if (typeof (price) !== "number")
            stored.price = "el precio tiene que ser número";

        if (typeof (quantity) !== "number")
            stored.quantity = "la entrada y salida tiene que ser número";


        if (quantity > 0)
            Model.input = quantity;
        else
            Model.output = Math.sign(quantity) * quantity


        if (Object.values(stored).length === 0) {
            const collection = await Model.save();


            if (collection) res.status(200).send({ collection })
        }

        else throw ({ code: "type", stored })



    }
    catch (error) {
        CatchError(res, error);

    }



}

async function Get(req, res) {
    const { business, establishment } = req.user;
    try {
        if (establishment) {
            let get = await Models.find({ "business": business, "establishment": establishment })
                .populate(
                    {
                        path: "products",
                        populate: [{ path: "brand" }, { path: "category" }]
                    }
                )
            res.status(200).send(get)

        }
        else {
            throw ({ code: 403, message: "Este usuario no ha sido asignado a ningun establecimiento." })
        }

    } catch (error) {
        CatchError(res, error);

    }


}


async function View(req, res) {
    const { business, establishment } = req.user;

    try {

        const get = await Models
            .aggregate(
                [
                    {
                        $group:
                        {
                            children: {
                                $addToSet:
                                {
                                    business: "$business",
                                    description: "$description",
                                    establishment: "$establishment",
                                    expiration: "$expiration",
                                    input: "$input",
                                    output: "$output",
                                    price: "$price",
                                    products: "$products",
                                    _id: "$_id",
                                }

                            },

                            _id: '$products',
                            count: { $sum: 1 },
                            price: { $avg: "$price" },
                            input: { $sum: '$input' },
                            output: { $sum: '$output' }
                        }
                    },
                    {
                        $addFields: {
                            ids: "$_id",
                            total: { $subtract: ["$input", "$output"] }
                        }
                    },

                    // { $project: { date: '$_id', _id: 1, _id: 0 } },
                    { $lookup: { from: 'products', localField: 'ids', foreignField: '_id', as: 'products' }, },
                    { $unwind: "$products" },
                    { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                    { $unwind: "$products.brand" },
                    {
                        $project: {
                            _id: "$_id",
                            children: "$children",
                            count: "$count",
                            ids: "$ids",
                            output: "$output",
                            price: "$price",
                            price: "$count",
                            products:
                            {
                                brand: "$products.brand",
                                business: "$products.business",
                                category: "$products.category",
                                cb: "$products.cb",
                                description: "$products.description",
                                features: "$products.features",
                                model: "$products.model",
                                name: "$products.name",
                                price: { $convert: { input: "$products.price", to: "double" } },
                                provider: "$products.provider",
                                _id: "$products._id",
                            },
                            total: "$total",
                        }
                    },
                    { $sort: { _id: -1 } },



                ],



            )

        res.status(200).send(get)


    } catch (error) {
        CatchError(res, error);

    }


}

async function Find(req, res) {

    const { id } = req.params
    const business = Authorization.business(req);



    var os = require('os');
    os.userInfo().username


    const establishment = Authorization.establishment(req);
    try {
        if (establishment) {


            const get = await Models
                .aggregate(
                    [
                        {
                            $group:
                            {
                                children: {
                                    $addToSet:
                                    {
                                        business: "$business",
                                        description: "$description",
                                        establishment: "$establishment",
                                        expiration: "$expiration",
                                        input: "$input",
                                        output: "$output",
                                        price: "$price",
                                        products: "$products",
                                        _id: "$_id",
                                    }

                                },

                                _id: '$products',
                                count: { $sum: 1 },
                                price: { $avg: "$price" },
                                input: { $sum: '$input' },
                                output: { $sum: '$output' }
                            }
                        },
                        {
                            $addFields: {
                                ids: "$_id",
                                total: { $subtract: ["$input", "$output"] }
                            }
                        },

                        { $lookup: { from: 'products', localField: 'ids', foreignField: '_id', as: 'products' }, },
                        { $unwind: "$products" },
                        { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                        { $unwind: "$products.brand" },
                        { $match: { "products.cb": id } },
                        { $sort: { _id: -1 } },


                    ],



                )
            if (get.length > 0)
                res.status(200).send(...get)
            else
                throw ({ code: 404, message: "No hay datos." })

        }
        else {
            throw ({ code: 403, message: "Este usuario no ha sido asignado a ningun establecimiento." })
        }

    } catch (error) {
        CatchError(res, error);

    }




}


async function Update(req, res) {
    const { params } = req
    const { body } = req
    const name = body.name.trim()
    const business = Authorization.business(req);
    try {
        const collection = await Models.findOne({ "_id": body._id, "business": business });
        const collection1 = await Models.findOne({ "name": name, "business": business, "_id": { $ne: body._id } });

        if (params.id != body._id) throw { code: 406, message: `No se pudo modificar porque los datos a sido modificado por terceros ` }
        if (!collection) throw { code: 403, message: `No tienes permiso para eliminar la marca ${name} ` }
        if (collection1) throw { code: 404, message: `Ya existe la marca ${name} ` }

        const collection2 = await Models.findOneAndUpdate({ "_id": body._id }, { "name": name });
        if (collection2) res.status(200).send({ old: collection2, new: collection })
        else throw { code: 404, message: `Otro usuario modifico los datos ` }


    }

    catch (error) {
        CatchError(res, error)

    }



}




async function Delete(req, res) {
    const { id } = req.params.id
    const business = Authorization.business(req);

    try {
        const collection = await Models.findById(id)
        const collection1 = await Models.findOne({ "_id": id, "business": business })



        if (!collection) throw { code: 404, message: "No se pudo eliminar porque los datos no existe" }

        if (!collection1) throw { code: 403, message: `No tienes permiso para eliminar la marca ${collection.name} ` }

        const collection2 = await Models.deleteOne({ "_id": id })

        if (collection2) res.status(200).send(collection2)
        else throw { code: 404, message: "No se pudo eliminar." }


    } catch (error) {

        CatchError(res, error)

    }


}


module.exports = {
    Add, Get, Update, Delete, Find, View
};