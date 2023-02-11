
const Models = require("models/shipping");
const { CatchError } = require("services/catchError");
const moment = require("moment");






async function Add(req, res) {
    const { establishment, _id: user } = req.user;

    const Model = new Models(req.body);
    if (establishment)
        Model.establishment = establishment;
    if (user)
        Model.user = user;
    try {
        const collection = await Models.findOne({ "establishment": establishment, "name": Model.name, deleted_at: null })

        if (collection) throw { code: 404, message: `Ya existe el transporte ${Model.name}` }

        const collection1 = await Model.save();

        if (!collection1) throw ({ collection1 })

        res.status(200).send({ collection1 })


    }
    catch (error) {
        CatchError(res, error);

    }



}

function Get(req, res) {
    const establishment = req.user.establishment;
    const user = req.user._id


    Models.find(
        { $or: [{ 'establishment': establishment }, { 'user': user },], deleted_at: null })
        .then((stored) => {
            res.status(200).send(stored)
        })
        .catch((error) => {
            CatchError(res, error);
        })



}





async function Find(req, res) {

    try {
        const { id } = req.params
        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "Transporte no encontrado." }

        else res.status(200).send(collection)

    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { _id, name } = req.body
    const { establishment } = req.user;
    try {
        const find = await Models.findOne({ "_id": { $ne: _id }, "establishment": establishment, name: name, deleted_at: null });


        if (find) throw { code: 404, message: `Ya existe la Tranporte ${name} ` }

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
        const { id } = req.params
        const deleted_at = moment().format();
        const collection = await Models.findById(id)
        if (!collection) throw { code: 404, message: "No existe el transporte." }

        // const collectionProducts = await ModelsProducts.find({ _id: id });


        // if (collectionProducts.length === 0) {
        // const deleteProduct = await Models.deleteOne({ "_id": id })
        // if (deleteProduct.deletedCount === 0) throw { code: 404, message: "No se pudo eliminar." }
        // }
        // else {
        const deleteProduct = await Models.findByIdAndUpdate(id, { deleted_at })
        // if (!deleteProduct) throw { code: 404, message: "No se pudo eliminar." }
        // }
    } catch (error) {

        CatchError(res, error)

    }


}

module.exports = {
    Add, Get, Update, Delete, Find
};