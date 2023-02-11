
const Models = require("models/business");
const { CatchError } = require("services/catchError");





async function Find(req, res) {
    const { business } = req.user
    try {
        const collection = await Models.findOne({ _id: business })


        if (!collection)
            throw { code: 404, message: `No existe el negocio.` }
        res.status(200).send(collection);





    } catch (error) {
        CatchError(res, error);
    }





}





async function Update(req, res) {
    const { id } = req.params
    try {
        const collection = await Models.findByIdAndUpdate(id, req.body)


        if (!collection) throw { code: 404, message: `No se encontro negocio` }
        res.status(200).send(collection)


    } catch (error) {

        CatchError(res, error)

    }


}


module.exports = {
    Find, Update
};