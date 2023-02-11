
const Models = require("../models/output");
const { CatchError } = require("../services/catchError");





async function Get(req, res) {
    try {

        const { business, establishment } = req.user
        const get =
            await Models.find({ "business": business, "establishment": establishment })
                .populate(["seller", "product"]);

        if (get)
            res.status(200).send(get)
        else throw { code: 404, message: `No se pudo modificar los datos.` }



    } catch (error) {

        CatchError(res, error);
    }

}





/////////////////////validation



module.exports = {
    Get
};

