const moment = require("moment");
const ObjectId = require('mongodb').ObjectId;


function validation(validate, body) {
    newValidation = new Object();
    for (const key in validate) {
        const { type, repeat, require } = validate[key]
        const typeBody = typeof (body[key])
        const typeBodyArray = Array.isArray(body[key])
        const value = body[key];
        const condition = type !== typeBody
        const email = /^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/


        if (typeBody == "undefined")
            continue;
        else if (!value)
            newValidation[key] = "No debe de estar vacio.";


        else if (typeBody !== type && type === "string")
            newValidation[key] = "Debe de tener texto correcto.";


        else if (typeBody !== type && type === "number")
            newValidation[key] = "Debe de ser número correcto.";


        else if (type === "object_id" && !ObjectId.isValid(body[key]))
            newValidation[key] = "No es un objeto";

        else if (type === "repeat" && body[repeat] !== body[key]) {
            if (Array.isArray(body[repeat])) {

                if (!body[repeat].find(e => e === body[key]))
                    newValidation[key] = "La lista tiene que coincidir.";

            }
            else {
                newValidation[key] = "No coinciden.";
            }

        }

        else if (type === "date" && !moment(body[key]).isValid())
            newValidation[key] = "formato de fecha incorrecto.";

        else if (type === "email" && !email.test(value))
            newValidation[key] = "Email incorrecto.";

        else if (type === "array" && !typeBodyArray)
            newValidation[key] = "No es un arreglo.";

        else if ((type === "array&object_id" && typeBodyArray))
            if (body[key].filter((e) => ObjectId.isValid(e)).length !== body[key].length)
                newValidation[key] = "No es un objetos";




            else if (require === true && body[key] === null)
                newValidation[key] = [newValidation[key], "No debe de estar vacio."];

            else { }

    }

    if (Object.values(newValidation).length > 0)
        return (newValidation)
    else return (null)






}


module.exports = validation;
