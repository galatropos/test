const validation = require("services/validation");
const { CatchError } = require("services/catchError");



async function category(req, res, next) {
    try {
        if (Object.entries(req.body).length > 0)
            req.body.name = req.body.name.toUpperCase()


        const validate = validation(
            {
                name: {
                    type: "string",
                    require: true,
                }
            },
            req.body)
        if (validate) throw { code: "validate", stored: newValidation }
        else
            next()

    } catch (error) {
        console.log(error);
        CatchError(res, error)
    }




}


module.exports = category;
