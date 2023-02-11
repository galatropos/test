
const Models = require("../models/category");
const Authorization = require("../services/Authorization");
const { CatchError } = require("../services/catchError");






async function Add(req, res) {
    const { body } = req
    const name = body.name.trim()

    Model = new Models;
    Model.name = name;

    try {
        const collection = await Models.findOne({ "name": name })

        if (collection) throw { code: 404, message: `Ya existe la categoría ${name}` }

        const collection1 = await Model.save()
        if (collection1) res.status(200).send({ collection1 })
        else throw ({ collection1 })



    }
    catch (error) {
        CatchError(res, error);

    }



}

function Get(req, res) {

    Models.find()
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
            throw { code: 404, message: "categoría no encontrado." }



    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { params } = req
    const { body } = req
    const name = body.name.trim()

    try {
        const collection1 = await Models.findOne({ "name": name, "_id": { $ne: body._id } });

        if (params.id != body._id) throw { code: 406, message: `No se pudo modificar porque los datos a sido modificado por terceros ` }
        if (collection1) throw { code: 404, message: `Ya existe la categoría ${name} ` }

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

        if (!collection1) throw { code: 403, message: `No tienes permiso para eliminar la categoría ${collection.name} ` }

        const collection2 = await Models.deleteOne({ "_id": id })

        if (collection2) res.status(200).send(collection2)
        else throw { code: 404, message: "No se pudo eliminar." }


    } catch (error) {

        CatchError(res, error)

    }


}


module.exports = {
    Add, Get, Update, Delete, Find
};