
const ObjectId = require('mongoose').Types.ObjectId;
const Models = require("models/address");
const { CatchError } = require("services/catchError");
const moment = require("moment");




async function Get(req, res) {
    const user = req.user._id
    const deleted_at = null;


    const stored = await Models
        .aggregate(
            [
                { $match: { user, deleted_at } },

                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        user: "$user",
                        lat: { $convert: { input: "$lat", to: "double" } },
                        lng: { $convert: { input: "$lng", to: "double" } },
                        ZIP: "$ZIP",
                        state: "$state",
                        municipality: "$municipality",
                        locality: "$locality",
                        address: "$address",
                        reference: "$reference",
                        numExt: "$numExt",
                        numInt: "$numInt",

                    },

                },

                { $sort: { product: -1 } },

            ]
        );

    res.status(200).send(stored)
    // Models.find({ "user": user, deleted_at: null })
    //     .then((stored) => {
    //         res.status(200).send(stored)
    //     })
    //     .catch((error) => {
    //         CatchError(res, error);
    //     })



}
async function Find(req, res) {
    const user = ObjectId(req.user._id)
    const id = ObjectId(req.params)
    // const { id } = req.params

    console.log(id)
    const stored = await Models
        .aggregate(
            [
                { $match: { _id: id, user, deleted_at: null } },
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        user: "$user",
                        lat: { $convert: { input: "$lat", to: "double" } },
                        lng: { $convert: { input: "$lng", to: "double" } },
                        ZIP: "$ZIP",
                        state: "$state",
                        municipality: "$municipality",
                        locality: "$locality",
                        address: "$address",
                        reference: "$reference",
                        numExt: "$numExt",
                        numInt: "$numInt",

                    },

                },

                { $sort: { product: -1 } },

            ]
        );
    if (!stored) throw { code: 404, message: "No pudo dar de alta." }

    res.status(200).send(stored[0])



}
async function Add(req, res) {
    try {
        console.log("object")
        const user = req.user._id;
        const Model = new Models(req.body)
        Model.user = user;


        const collection = await Models.findOne({ "user": user, "name": Model.name, deleted_at: null })

        if (collection) throw { code: 404, message: `Ya existe: ${Model.name}` }

        const stored = await Model.save()
        if (!stored) throw { code: 404, message: "No pudo dar de alta." }
        res.status(200).send({ stored })



    }
    catch (error) {
        console.log(error)
        CatchError(res, error);

    }

}
async function Update(req, res) {
    try {
        const { id } = req.params;
        const update = await Models.findByIdAndUpdate(id, req.body)
        if (!update) throw { code: 404, message: `Ya existe: ${Model.name}` }
        res.status(200).send({ update })

    } catch (error) {
        console.log(error)
        CatchError(res, error);

    }
}
async function Deletes(req, res) {
    try {
        const deleted_at = moment().format()
        const { id } = req.params;

        console.log(deleted_at)
        console.log(req.params)

        const update = await Models.findByIdAndUpdate(id, { deleted_at })
        if (!update) throw { code: 404, message: `No se pudo eliminar: ${Model.name}` }
        res.status(200).send({ update })

    } catch (error) {
        console.log(error)
        CatchError(res, error);

    }
}
module.exports = {
    Get, Add, Find, Update, Deletes
};