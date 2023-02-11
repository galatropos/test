
const Models = require("models/word");
const { CatchError } = require("services/catchError");






async function Add(req, res) {

    try {
        const { body } = req

        const collection = await Models.findOne({ "name": body.name })


        if (collection) throw { code: 404, message: `Ya existe la palabra ${body.name}` }

        const Model = new Models(body);

        const collection1 = await Model.save()


        if (!collection1) throw ({ collection1 })

        res.status(200).send({ collection1 })



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


async function Random(req, res) {
    const random = await Models.aggregate([
        { $match: { $expr: { $lt: [0.5, { $rand: {} }] } } },
        {
            $group: {
                _id: "$_id",
                name: { "$first": "$name" }
            }
        }

    ]);
    console.log(random[0]);

    // Models.find()
    //     .then((stored) => {
    //         res.status(200).send(stored)
    //     })
    //     .catch((error) => {
    //         CatchError(res, error);
    //     })



}


async function Find(req, res) {

    const { id } = req.params

    try {
        const collection = await Models.findById(id)

        if (collection)

            res.status(200).send(collection)

        else
            throw { code: 404, message: "Palabra no encontrado." }



    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { body } = req
    try {
        const collection1 = await Models.findOne({ "name": body.name, "_id": { $ne: body._id } });

        if (collection1) throw { code: 404, message: `Ya existe la palabra: ${body.name} ` }

        const collection2 = await Models.findOneAndUpdate({ "_id": body._id }, { "name": body.name });

        if (!collection2) throw { code: 404, message: `Otro usuario modifico los datos ` }

        res.status(200).send({ old: collection2, new: collection1 })


    }

    catch (error) {
        console.log(error);
        CatchError(res, error)

    }



}




async function Delete(req, res) {

    try {
        const { id } = req.params

        const { deletedCount } = await Models.deleteOne({ "_id": id })

        if (deletedCount === 0) throw { code: 404, message: "No se pudo eliminar." }

        res.status(200).send({ message: "Se elimino correctamente." })


    } catch (error) {
        console.log(error);
        CatchError(res, error)

    }


}


module.exports = {
    Add, Get, Update, Delete, Find, Random
};