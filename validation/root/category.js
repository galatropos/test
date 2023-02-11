const validation = require("services/validation");
const { CatchError } = require("services/catchError");



async function category(req, res, next) {
    try {
        const validate = validation(
            {
                name: {
                    type: "string",
                    require: true,
                }
            },
            req.body)
        if (validate)
            throw { code: "validate", stored: newValidation }
        else
            next()

    } catch (error) {
        CatchError(res, error)
    }




}


module.exports = category;
