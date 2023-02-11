
const Models = require("../models/products");
const Online = require("../models/online");
const ObjectId = require('mongoose').Types.ObjectId;
const { CatchError } = require("../services/catchError");
const { ProductAIByOne } = require("./productsAI");





async function Get(req, res) {


    try {
        const get = await Online.aggregate(
            [
                { $match: {} },

                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products' }, },
                { $unwind: "$products" },
                { $unwind: "$products.subcategory" },


                {
                    $group: {
                        _id: "$products.subcategory",
                        shipping: { $first: "$shipping" },
                        prices: { $first: "$price" },
                        products: {
                            $addToSet: {
                                _id: "$products._id",
                                order: "$_id",
                                name: "$products.name",
                                cb: "$products.cb",
                                brand: "$products.brand",
                                business: "$products.business",
                                description: "$products.description",
                                category: "$products.category",
                                subcategory: "$products.subcategory",
                                model: "$products.model",
                                feactures: "$products.feactures",
                                image: "$products.image",
                                price: { $convert: { input: "$price", to: "double" } },

                            },
                        },
                        category: { $first: "$products.subcategory" },
                        // price: { $first: { $convert: { input: "$price", to: "double" } } },


                    }
                },
                { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' }, },
                {
                    $unwind: { path: "$category", "preserveNullAndEmptyArrays": true }
                },

            ]
        )

        res.status(200).send(get)


    } catch (error) {
        CatchError(res, error);
    }

}


async function FindOne(req, res) {
    console.log("first")
    const { id } = req.params;
    const _id = ObjectId(req.params.id)
    try {
        let get = await Online.aggregate(
            [
                { $match: { _id: _id } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products' }, },
                { $unwind: { path: "$products", "preserveNullAndEmptyArrays": true }, },
                { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                { $unwind: { path: "$products.brand", "preserveNullAndEmptyArrays": true }, },
                {
                    $group: {
                        _id: "$products._id",
                        order: { $first: "$_id" },
                        product: { $first: "$products._id" },
                        name: { $first: "$products.name" },
                        image: { $first: "$products.image" },
                        brand: { $first: "$products.brand.name" },
                        features: { $first: "$products.features" },
                        model: { $first: "$products.model" },
                        price: { $first: { $convert: { input: "$price", to: "double" } } },
                        description: { $first: "$products.description" },
                        shipping: { $first: "$shipping" },
                    }
                }




            ]
        )
        const { stock } = await ProductAIByOne(get[0].product)

        get = { ...get[0], stock }

        res.status(200).send(get)


    } catch (error) {
        CatchError(res, error);
    }

}


async function ProductsByCategory(req, res) {
    let { id } = req.params;
    id = id.split(",")

    const functionMatchSubcategory = (sub) => {

        return (
            sub.map(sub => ({ "$match": { "subcategory": sub } }))
        )
    }

    try {
        const get = await Online.aggregate(
            [
                { $match: {} },

                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products' }, },
                { $unwind: { path: "$products", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                { $unwind: { path: "$products.brand", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'categories', localField: 'products.subcategory', foreignField: '_id', as: 'products.subcategory' }, },

                {
                    $group: {
                        _id: "$_id",
                        order: { $first: "$_id" },
                        shipping: { $first: "$shipping" },
                        product: { $first: "$products._id" },
                        name: { $first: "$products.name" },
                        image: { $first: "$products.image" },
                        brand: { $first: "$products.brand.name" },
                        features: { $first: "$products.features" },
                        model: { $first: "$products.model" },
                        price: { $first: { $convert: { input: "$price", to: "double" } } },
                        description: { $first: "$products.description" },
                        subcategory: { $first: "$products.subcategory.name" },
                    }
                },
                // { $match: { subcategory: id } }
                ...functionMatchSubcategory(id),




            ]
        )
        res.status(200).send(get)


    } catch (error) {
        CatchError(res, error);
    }

}


async function ProductsByCart(req, res) {

    let { id } = req.params
    id = JSON.parse(id)
    let _id = []

    for (const key in id) {
        if (Object.hasOwnProperty.call(id, key)) {
            const element = id[key];
            if (element > 0)
                _id.push(ObjectId(key))
        }
    }

    _id = _id.map(id => ObjectId(id))

    try {
        let get = await Online.aggregate(
            [
                { $match: { _id: { $in: _id } } },

                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products' }, },
                { $unwind: { path: "$products", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                { $unwind: { path: "$products.brand", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'categories', localField: 'products.subcategory', foreignField: '_id', as: 'products.subcategory' }, },

                {
                    $group: {
                        _id: "$_id",
                        shipping: { $first: "$shipping" },
                        order: { $first: "$_id" },
                        business: { $first: "$business" },
                        establishment: { $first: "$establishment" },
                        product: { $first: "$products._id" },
                        name: { $first: "$products.name" },
                        image: { $first: "$products.image" },
                        brand: { $first: "$products.brand.name" },
                        features: { $first: "$products.features" },
                        model: { $first: "$products.model" },
                        price: { $first: { $convert: { input: "$price", to: "double" } } },
                        description: { $first: "$products.description" },
                        subcategory: { $first: "$products.subcategory.name" },
                    }
                },
                { $sort: { _id: -1 } },

            ]
        )
        get = get.map(async (get) => {
            // console.log(get)
            const { stock } = await ProductAIByOne(get.product)
            return await ({ ...get, stock: stock })
        })


        get = await Promise.all(get);



        res.status(200).send(get)
    } catch (error) {
        console.log(error)
        CatchError(res, error);
    }

}



async function ProductsByEstablishment(req, res) {
    let { id } = req.params;
    console.log(id)
    id = id.split(",")
    let establishment = ObjectId(id.shift())
    console.log(establishment)
    console.log(id)




    const functionMatchSubcategory = (sub) => {
        return (
            sub.map(sub => ({ "$match": { "subcategory": sub } }))
        )
    }


    try {
        const get = await Online.aggregate(
            [
                { $match: { establishment: establishment } },

                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'products' }, },
                { $unwind: { path: "$products", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'brands', localField: 'products.brand', foreignField: '_id', as: 'products.brand' }, },
                { $unwind: { path: "$products.brand", "preserveNullAndEmptyArrays": true }, },

                { $lookup: { from: 'categories', localField: 'products.subcategory', foreignField: '_id', as: 'products.subcategory' }, },

                {
                    $group: {
                        _id: "$_id",
                        shipping: { $first: "$shipping" },
                        order: { $first: "$_id" },
                        product: { $first: "$products._id" },
                        name: { $first: "$products.name" },
                        image: { $first: "$products.image" },
                        brand: { $first: "$products.brand.name" },
                        features: { $first: "$products.features" },
                        model: { $first: "$products.model" },
                        price: { $first: { $convert: { input: "$price", to: "double" } } },
                        description: { $first: "$products.description" },
                        subcategory: { $first: "$products.subcategory.name" },
                    }
                },
                // { $match: { subcategory: id } }
                ...functionMatchSubcategory(id),




            ]
        )
        res.status(200).send(get)
    } catch (error) {
        console.log(error)
        CatchError(res, error);
    }

}
/////////////////////validation


module.exports = {
    Get, FindOne, ProductsByCategory, ProductsByCart, ProductsByEstablishment
};

