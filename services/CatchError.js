exports.CatchError = function (res, error) {

    const { code, message, valueType, kind, stored, path } = error;
    const arrayError = Object.entries(error)

    if (code === 11000)
        res.status(404).send({ message: "Ya existe la información.", error })
    else if (code === 404)
        res.status(404).send(error)
    else if (code === 403)
        res.status(403).send(error)
    else if (code === 406)
        res.status(406).send({ message: "Los datos a sido modificado por terceros.", error })
    else if (code === 401)
        res.status(401).send({ message: "Los datos a sido modificado por terceros." })
    else if (code === "type")
        res.status(404).send({ message: "No pudo guardar la información.", stored })
    else if (code === "validate") {
        res.status(404).send({ message: "Verifique su formulario.", stored: arrayError[1][1] })
    }

    else if (kind === 'ObjectId' && valueType === 'string')
        res.status(503).send({ error })





    else {

        res.status(500).send({ message: "Error en el servidor.", error })
    }
}