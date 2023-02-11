
const Models = require("../models/establishment");
const Authorization = require("../services/Authorization");
const { CatchError } = require("../services/catchError");
const moment = require("moment")








async function Add(req, res) {
    const { name } = req.body;
    const { business } = req.user;
    Model = new Models;
    Model.name = name;
    Model.business = business
    console.log(Model)
    try {
        const collection = await Models.findOne({ "business": business, "name": name, "deleted_at": null })


        if (collection) throw { code: 404, message: `Ya existe el establecimiento ${name}` }

        const collection1 = await Model.save()
        if (collection1) res.status(200).send({ collection1 })
        else throw ({ collection1 })



    }
    catch (error) {
        console.log(error)
        CatchError(res, error);

    }



}

function Get(req, res) {
    const business = Authorization.business(req);

    Models.find({ "business": business, deleted_at: null })
        .then((stored) => {
            res.status(200).send(stored)
        })
        .catch((error) => {
            CatchError(res, error);
        })



}



async function Find(req, res) {

    const { id } = req.params
    const business = Authorization.business(req);

    try {
        const collection = await Models.findById(id)

        if (collection)

            if (business === collection.business)
                res.status(200).send(collection)
            else
                throw { code: 403, message: "No tienes permiso para el acceso a este establecimiento." }

        else
            throw { code: 404, message: "Establecimiento no encontrado." }



    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { params } = req
    const { body } = req
    const name = body.name
    const business = Authorization.business(req);

    try {
        const collection = await Models.findOne({ "_id": body._id, "business": business });
        const collection1 = await Models.findOne({ "name": name, "business": business, "_id": { $ne: body._id } });

        if (params.id != body._id) throw { code: 406, message: `No se pudo modificar porque los datos a sido modificado por terceros ` }
        if (!collection) throw { code: 403, message: `No tienes permiso para eliminar el establecimiento ${name} ` }
        if (collection1) throw { code: 404, message: `Ya existe el establecimiento ${name} ` }

        const collection2 = await Models.findOneAndUpdate({ "_id": body._id }, req.body);
        if (collection2) res.status(200).send({ old: collection2, new: collection })
        else throw { code: 404, message: `Otro usuario modifico los datos ` }


    }

    catch (error) {
        CatchError(res, error)

    }



}




async function Delete(req, res) {

    try {

        const { id } = req.params
        const deleted_at = moment().format();
        console.log(deleted_at)
        console.log(id)
        const collection2 = await Models.findOneAndUpdate({ "_id": id }, { deleted_at: deleted_at })
        console.log(collection2)
        if (collection2) res.status(200).send(collection2)
        else throw { code: 404, message: "No se pudo eliminar." }


    } catch (error) {
        // console.log(error)
        CatchError(res, error)

    }


}


module.exports = {
    Add, Get, Update, Delete, Find
};