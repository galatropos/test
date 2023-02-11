
const Models = require("models/products");
const moment = require("moment")
const fs = require("fs")
const { CatchError } = require("../services/catchError");
const webp = require("services/webp");
const ObjectId = require('mongoose').Types.ObjectId;






async function Add(req, res) {
    const { cb, name } = req.body;
    const { business } = req.user;

    const Model = new Models(req.body);
    Model.business = business;
    try {
        const collection = await Models.findOne({ "business": business, "cb": cb, deleted_at: null })

        if (collection) throw { code: 404, message: `Ya existe el codigo de barra "${cb}  del product ${name}"` }


        const add = await Model.save()
        const path = `./public/products/${add._id.toString()}/`

        if (req.body.image) {

            fs.mkdirSync(path, { recursive: true });
            req.body.image.map((name) => webp(path, name))
            // webp(`./public/products/${add._id.toString()}`, name)
        }

        if (add) res.status(200).send(add)
        if (!add) throw { code: 404, message: "producto no encontrado." }



    }
    catch (error) {
        CatchError(res, error);

    }



}

async function Get(req, res) {

    try {
        const { business } = req.user;


        const get = await Models
            .aggregate([
                { $match: { "business": business, deleted_at: null } },
                { $lookup: { from: 'categories', localField: 'subcategory', foreignField: '_id', as: 'subcategory' }, },

                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        brand: "$brand",
                        provider: "$provider",
                        cb: "$cb",
                        price: { $convert: { input: "$price", to: "double" } },
                        description: "$description",
                        category: "$category",
                        model: "$model",
                        features: "$features",
                        subcategory: "$subcategory.name",
                        image: "$image"

                    },
                },


                { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand', }, },
                { $unwind: { path: "$brand", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider', }, },
                { $unwind: { path: "$provider", "preserveNullAndEmptyArrays": true } },

                {
                    $lookup: {
                        from: 'categories',
                        let: { categoryId: "$category" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$categoryId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'category',
                    },
                },
                { $unwind: { path: "$category", "preserveNullAndEmptyArrays": true } },




            ]);
        res.status(200).send(get)

    } catch (error) {
        CatchError(res, error);

    }





}



async function Find(req, res) {
    const { id } = req.params
    try {

        let get = await Models
            .aggregate(
                [
                    { $match: { _id: new ObjectId(id) } },
                    {
                        $project: {
                            _id: "$_id",
                            name: "$name",
                            brand: "$brand",
                            provider: "$provider",
                            cb: "$cb",
                            price: { $convert: { input: "$price", to: "double" } },
                            description: "$description",
                            category: "$category",
                            model: "$model",
                            features: "$features",
                            subcategory: "$subcategory",
                        }
                    },

                    { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand', }, },
                    { $unwind: { path: "$brand", "preserveNullAndEmptyArrays": true } },

                    { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider', }, },
                    { $unwind: { path: "$provider", "preserveNullAndEmptyArrays": true } },

                    { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category', }, },
                    { $unwind: { path: "$category", "preserveNullAndEmptyArrays": true } },


                ]
            );


        if (!get[0]) throw { code: 404, message: "producto no encontrado." }

        if (get[0].subcategory)
            get[0].subcategory = get[0].subcategory.map(e => [e])
        res.status(200).send(get[0])





    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { body, user } = req;
    const { cb, _id, name } = body;
    const { business } = user;




    try {
        const collection = await Models.findOne({ "_id": { $ne: _id }, "business": business, cb: cb, deleted_at: null });
        if (collection) throw { code: 404, message: `Ya existe el código de barra ${cb} con el nombre de ${name} ` }
        const update = await Models.findByIdAndUpdate(_id, body)
        if (!update) throw { code: 404, message: `No se pudo actualizar` }

        res.status(200).send({ old: update, new: collection })

    }

    catch (error) {
        CatchError(res, error)

    }




}


async function Order(req, res) {
    try {
        const { id } = req.params

        const collection = await Models.findById(id).populate('brand');

        if (!collection) throw { code: 404, message: "Producto no encontrado." }
        res.status(200).send(collection)

    } catch (error) {
        CatchError(res, error)

    }
}

async function Delete(req, res) {
    const id = req.params.id
    const deleted_at = moment().format()
    try {
        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "No se pudo eliminar porque los datos no existe" }

        const stored = await Models.findByIdAndUpdate(id, { deleted_at: deleted_at })
        if (!stored) throw { code: 404, message: "No se pudo eliminar." }

        res.status(200).send({ message: `El producto ${collection.name} con el cb ${collection.cb} fue eliminado correctamente.` })


    } catch (error) {

        CatchError(res, error)

    }


}
async function ProductsByCategory(req, res) {
    try {
        let { id, sub } = req.params;
        id = id.split(",")




        const functionMatchSubcategory = (sub) => {

            return (
                sub.map(sub => ({ "$match": { "subcategory.name": sub } }))
            )
        }
        const get = await Models
            .aggregate([
                { $lookup: { from: 'categories', localField: 'subcategory', foreignField: '_id', as: 'subcategory' }, },

                { $match: { deleted_at: null } },

                ...functionMatchSubcategory(id),
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        brand: "$brand",
                        provider: "$provider",
                        cb: "$cb",
                        price: { $convert: { input: "$price", to: "double" } },
                        description: "$description",
                        category: "$category",
                        model: "$model",
                        features: "$features",
                        subcategory: "$subcategory.name",
                        image: "$image"

                    },
                },


                { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand', }, },
                { $unwind: { path: "$brand", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider', }, },
                { $unwind: { path: "$provider", "preserveNullAndEmptyArrays": true } },

                {
                    $lookup: {
                        from: 'categories',
                        let: { categoryId: "$category" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$categoryId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'category',
                    },
                },
                { $unwind: { path: "$category", "preserveNullAndEmptyArrays": true } },

            ]);

        res.status(200).send(get)



    } catch (error) {
        CatchError(res, error)


    }


}
async function ProductsByBusiness(req, res) {

    try {
        let { id, sub } = req.params;
        id = id.split(",")
        let business = ObjectId(id.shift())




        const functionMatchSubcategory = (sub) => {

            return (
                sub.map(sub => ({ "$match": { "subcategory.name": sub } }))
            )
        }
        const get = await Models
            .aggregate([
                { $lookup: { from: 'categories', localField: 'subcategory', foreignField: '_id', as: 'subcategory' }, },

                { $match: { deleted_at: null, business: business } },

                ...functionMatchSubcategory(id),
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        brand: "$brand",
                        provider: "$provider",
                        cb: "$cb",
                        price: { $convert: { input: "$price", to: "double" } },
                        description: "$description",
                        category: "$category",
                        model: "$model",
                        features: "$features",
                        subcategory: "$subcategory.name",
                        image: "$image"

                    },
                },


                { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand', }, },
                { $unwind: { path: "$brand", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider', }, },
                { $unwind: { path: "$provider", "preserveNullAndEmptyArrays": true } },

                {
                    $lookup: {
                        from: 'categories',
                        let: { categoryId: "$category" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$categoryId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'category',
                    },
                },
                { $unwind: { path: "$category", "preserveNullAndEmptyArrays": true } },

            ]);

        res.status(200).send(get)

    } catch (error) {
        CatchError(res, error)

    }

}

async function ProductsByCart(req, res) {
    try {

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

        let get = await Models
            .aggregate([
                { $lookup: { from: 'categories', localField: 'subcategory', foreignField: '_id', as: 'subcategory' }, },

                { $match: { deleted_at: null, _id: { $in: _id } } },

                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        brand: "$brand",
                        provider: "$provider",
                        cb: "$cb",
                        price: { $convert: { input: "$price", to: "double" } },
                        description: "$description",
                        category: "$category",
                        model: "$model",
                        features: "$features",
                        subcategory: "$subcategory.name",
                        image: "$image",
                        business: "$business"

                    },
                },


                { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand', }, },
                { $unwind: { path: "$brand", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider', }, },
                { $unwind: { path: "$provider", "preserveNullAndEmptyArrays": true } },

                {
                    $lookup: {
                        from: 'categories',
                        let: { categoryId: "$category" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$categoryId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: 'category',
                    },
                },
                { $unwind: { path: "$category", "preserveNullAndEmptyArrays": true } },

            ]);

        get = get.map(get => ({ ...get, cart: id[get._id] }))
        res.status(200).send(get)
    } catch (error) {
        CatchError(res, error)

    }

}

module.exports = {
    Add, Get, Update, Delete, Find, Order, ProductsByCategory, ProductsByBusiness, ProductsByCart
};