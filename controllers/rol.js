
const Rol = require("../models/rol");
const Models = require("../models/rol");
const User = require("../models/user");
const Authorization = require("../services/Authorization")
const Route = require("models/route");
const { CatchError } = require("../services/catchError");






function AddRol(req, res) {

    const rol = new Rol();
    const { name } = req.body;
    const business = req.user.business

    rol.name = name;
    rol.permission = [];
    rol.business = business;


    Rol.findOne({ 'name': name, "business": business }, (err, stored) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor al crear rol" })
        }
        if (stored) {
            res.status(404).send({ message: "Rol ya existe" })

        }
        else (
            rol.save((err, stored) => {
                if (err) {

                    res.status(404).send({ message: "El Rol ya esta registrado" })
                }
                else {
                    if (!stored) {
                        res.status(404).send({ message: "Error al crear Rol" })
                    }
                    else {
                        res.status(200).send({ message: "Rol creado correctamente" })
                    }
                }

            })
        )

    });






}

async function GetRol(req, res) {

    const { business } = req.user;

    try {

        const get = await Rol.aggregate([
            {
                $match: { business: business },

            },
            {
                $project: {
                    _id: "$_id",
                    name: "$name",
                }
            }
        ])


        res.status(200).json(get);



    }
    catch (error) {
        CatchError(res, error)

    }
}



function FindRol(req, res) {
    const { id } = req.params;

    Rol.findOne({ '_id': id }, (err, stored) => {

        if (err) {
            res.status(404).send({ message: "rol no encontrado." });
        }
        else {
            if (!stored) {
                res.status(404).send({ message: "rol no encontrado." });

            }
            else {
                res.status(200).send(stored);

            }
        }


    }


    );


}


async function UpdateRol(req, res) {


    try {
        const { id } = req.params;
        const { business } = req.user;
        const { _id, name, permission, matriz } = req.body;


        if (id !== _id)
            throw { code: 403, message: "Los datos fueron modificados por terceros." }


        const find = await Models.findOne({ _id: { $ne: id }, name: name, business: business })
        if (find)
            throw { code: 404, message: "Ya existe el nombre." }



        const update = await Models.findByIdAndUpdate(id, { ...req.body })

        if (update)
            res.status(200).send({ message: "Datos modificado correctamente." });
        else
            throw { code: 404, message: "Datos no modificado." }



    }

    catch (error) {
        CatchError(res, error);

    }



}




async function DeleteRol(req, res) {
    try {
        const { id } = req.params;
        const user = await User.find({ rol: id })
        if (user.length > 0) throw { code: 404, message: `Tienes asignado a ${user.length} usuarios. .` }

        const get = await Models.deleteOne({ _id: id })
        if (get.deletedCount === 0) throw { code: 404, message: `No se pudo eliminar.` }

        res.status(200).send({ message: "Rol eliminado correctamente" });

    } catch (error) {
        CatchError(res, error);

    }

}


function FindRoute(req, res) {

    // const user = Authorization.user(req);

    // User.findOne({ '_id': user }, (err, stored) => {
    //     if (err) {
    //         res.status(404).send({ message: "error en el servidor" });
    //     }

    //     if (stored) {
    //         if (stored.master) {

    //             Route.findOne({ "defaults": false }, (err, stored) => {
    //                 res.status(200).send(stored.route);
    //             })
    //         }
    //         else {
    //             Rol.findOne({ "_id": stored.rol }, (err, stored) => {
    //                 res.status(200).send(stored.permission);
    //             })

    //         }

    //     }
    //     else {

    //         res.status(404).send({ message: "Usuario no encontrado" });
    //     }
    // })
}
module.exports = {
    AddRol, GetRol, FindRol, UpdateRol, DeleteRol, FindRoute
};