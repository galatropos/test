const validation = require("services/validation");
const { CatchError } = require("services/catchError");



async function registration(req, res, next) {
    try {
        const validate = validation(
            {
                name: {
                    type: "string",
                    require: true,
                },
                lastname: {
                    type: "string",
                    require: true,
                },
                email: {
                    type: "string",
                    require: true,
                },
                user: {
                    type: "string",
                    require: true,
                },
                password: {
                    type: "password",
                    require: true,
                },
                repeatPassword: {
                    type: "repeat",
                    repeat: "password",
                    require: true,
                },
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


module.exports = registration;
