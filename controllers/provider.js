
const Models = require("models/provider");
const ModelsProducts = require("models/products");
const { CatchError } = require("../services/catchError");
const moment = require("moment");





async function Add(req, res) {
    const { body, user } = req;
    const { name, lastname, businessProvider } = body;
    const { business, establishment } = user;
    const Model = new Models(body);
    Model.business = business;
    Model.establishment = establishment;
    try {
        const collection = await Models.findOne({ "business": business, "name": name, "lastname": lastname, "businessProvider": businessProvider })
        if (collection) throw { code: 404, message: `Ya existe el proveedor "${name}  ${lastname}" asignado con el negocio "${businessProvider}"` }

        const collection1 = await Model.save()
        if (collection1) res.status(200).send({ collection1 })
        else throw ({ collection1 })



    }
    catch (error) {
        CatchError(res, error);

    }



}

function Get(req, res) {
    Models.find({ establishment: req.user.establishment, deleted_at: null })
        .then((stored) => {
            res.status(200).send(stored)
        })
        .catch((error) => {
            CatchError(res, error);
        })



}



async function Find(req, res) {

    const { id } = req.params

    try {
        const collection = await Models.findById(id)

        if (collection)

            res.status(200).send(collection)

        else
            throw { code: 404, message: "proveedor no encontrado." }



    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    try {
        const { business } = req.user;
        const { name, lastname, businessProvider, _id } = req.body;

        const collection = await Models.findOne({ _id: { $ne: _id }, "business": business, "name": name, "lastname": lastname, "businessProvider": businessProvider })
        if (collection) throw { code: 404, message: `Ya existe el proveedor "${name}  ${lastname}" asignado con el negocio "${businessProvider}"` }

        const stored = await Models.findByIdAndUpdate(req.body._id, req.body);
        if (!stored) throw { code: 404, message: `No se pudo actualizar.` }
        res.status(200).send({ old: stored, new: req.body })
    }

    catch (error) {
        CatchError(res, error)

    }


}




async function Delete(req, res) {
    try {
        const { id } = req.params
        const collection = await Models.findById(id)
        const deleted_at = moment().format();

        if (!collection) throw { code: 404, message: "No se pudo eliminar porque los datos no existe" }

        const collectionProducts = await ModelsProducts.find({ provider: id });

        if (collectionProducts.length === 0) {
            const deleteProduct = await Models.deleteOne({ "_id": id })
            if (deleteProduct.deletedCount === 0) throw { code: 404, message: "No se pudo eliminar." }
        }
        else {
            const deleteProduct = await Models.findByIdAndUpdate(id, { deleted_at })
            if (!deleteProduct) throw { code: 404, message: "No se pudo eliminar." }
        }

        if (collection) res.status(200).send(collection)


    } catch (error) {
        CatchError(res, error)

    }


}


module.exports = {
    Add, Get, Update, Delete, Find
};