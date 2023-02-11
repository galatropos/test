
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const ProductsCustom = require("../models/productsCustom");
const Models = require("../models/user");
const Business = require("../models/business");
const Rol = require("../models/rol");
const Route = require("../models/route");
const jwt = require("../services/jwt");
const Authorization = require("../services/Authorization")
const mongoose = require("mongoose");
const moment = require("moment");
const { CatchError } = require("../services/catchError");


async function GetUserAdmin(req, res) {
    const { business } = req.user;


    try {
        let get = await Models.aggregate(
            [

                { $match: { business: business, seller: true } },

                { $lookup: { from: 'rols', localField: 'rol', foreignField: '_id', as: 'rol', }, },
                { $unwind: { path: "$rol", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
                { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        lastname: "$lastname",
                        email: "$email",
                        establishment: {
                            _id: "$establishment._id",
                            name: "$establishment.name",
                        },
                        rol: {
                            _id: "$rol._id",
                            name: "$rol.name",
                        },
                        deleted_at: "$deleted_at"


                    }
                }

            ]
        )

        res.status(200).json(get);



    }
    catch (e) {
        res.status(404).send({ message: "error en la bd" });
        // next(e)
    }

}

async function AddSeller(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const { email } = req.body;
        const { business } = req.user;
        const find = await Models.findOne({ "business": business, "email": email })
        if (find) throw { code: 404, message: `El usuario ${email}  existe.` }

        const model = new Models(req.body);
        model.business = business
        model.seller = true
        const stored = await model.save()
        if (!stored) throw { code: 404, message: `Usuario ${email} no fue creado.`, stored }

        res.status(200).send({ message: `Usuario ${email} creado correctamente.`, stored })

        // console.log(model)
    } catch (error) {
        CatchError(res, error)
    }
}

async function UpdateSeller(req, res) {
    try {
        console.log(req.body)
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const { email, _id } = req.body;
        const { business } = req.user;
        const find = await Models.findOne({ "business": business, "email": email, "_id": { "$ne": _id } })
        if (find) throw { code: 404, message: `El usuario ${email}  existe.` }


        const stored = await Models.findByIdAndUpdate(_id, { ...req.body })
        if (!stored) throw { code: 404, message: `El usuario ${email}  existe.` }

        res.status(200).send({ message: `Usuario ${email} actualizado correctamente.`, stored })

    } catch (error) {
        CatchError(res, error)
    }
}


async function DeleteUser(req, res) {
    try {

        const { id } = req.params
        const deleted_at = moment().format();
        let stored = [];
        const find = await Models.findOne({ _id: id, deleted_at: null },)

        if (find)
            stored = await Models.findByIdAndUpdate(id, { deleted_at: deleted_at })
        else
            stored = await Models.findByIdAndUpdate(id, { deleted_at: null })

        if (!stored) throw { code: 404, message: "No se pudo hacer la operación." }

        if (stored.deleted_at)
            res.status(200).send({ message: `El usuario ${stored.email} fue activado correctamente.`, stored })
        else
            res.status(200).send({ message: `El usuario ${stored.email} fue desactivado correctamente.`, stored })

    } catch (error) {
        console.log(error)
        CatchError(res, error)
    }
}


async function FindUser(req, res) {
    try {
        const { id } = req.params;
        const ObjectId = mongoose.Types.ObjectId;
        let get = await Models.aggregate(
            [

                { $match: { "_id": ObjectId(id), seller: true } },

                {
                    $project: {
                        _id: "$_id",
                        business: "$business",
                        name: "$name",
                        lastname: "$lastname",
                        email: "$email",
                        establishment: "$establishment",
                        rol: "$rol",
                        seller: "$seller",
                        deleted_at: "$deleted_at",



                    },
                },


            ]
        )

        get = get[0];
        if (!get) throw { code: 404, message: `Usuario no encontrado.` }


        res.status(200).send(get);



    }
    catch (error) {
        CatchError(res, error)

    }
}

async function FindUserMaster(req, res) {
    try {
        const { id } = req.params;
        const ObjectId = mongoose.Types.ObjectId;
        console.log("first")
        let get = await Models.aggregate(
            [

                { $match: { "_id": ObjectId(id) } },

                {
                    $project: {
                        _id: "$_id",
                        business: "$business",
                        name: "$name",
                        lastname: "$lastname",
                        email: "$email",
                        establishment: "$establishment",
                        rol: "$rol",
                        seller: "$seller",
                        deleted_at: "$deleted_at",



                    },
                },


            ]
        )

        get = get[0];
        if (!get) throw { code: 404, message: `Usuario no encontrado.` }


        res.status(200).send(get);



    }
    catch (error) {
        CatchError(res, error)

    }
}
///////////////////////////////////////////
async function SingIn(req, res) {
    const { email, password } = req.body;
    // const params = req.body;
    // const email = params.email;
    // const password = params.password;
    try {


        let get = await Models.aggregate(
            [
                { $match: { email: email } },
                { $lookup: { from: 'rols', localField: 'rol', foreignField: '_id', as: 'rol', }, },
                { $unwind: { path: "$rol", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
                { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },

                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        master: "$master",
                        password: "$password",
                        lastname: "$lastname",
                        email: "$email",
                        business: "$business",
                        rol: "$rol.permission",
                        establishment: "$establishment",
                        root: "$root",
                        seller: "$seller",
                        buyer: "$buyer",
                        logistic: "$logistic",
                        deleted_at: "$deleted_at",
                    }
                }
            ]
        );
        if (get.length === 0) throw { code: 404, message: `Usuario o contraseña incorrecta..` }

        get = get[0]

        if (!await bcrypt.compare(password, get.password)) throw { code: 404, message: `Usuario o contraseña incorrecta..` }

        if (get.deleted_at) throw { code: 404, message: `El usuario esta desactivado.` }

        if (get.master === true) {
            console.log("Soy master")
            const rol = await Route.findOne({ defaults: false, type: 2 });
            get.rol = [...rol.route]
        }
        if (get.root === true) {
            console.log("soy root")
            const rol = await Route.findOne({ defaults: false, type: 0 });
            get.rol = [...rol.route]
        }

        if (get.buyer === true) {
            console.log("soy comprador")
            const rol = await Route.findOne({ defaults: false, type: 3 });
            get.rol = [...rol.route]
        }

        if (get.logistic === true) {
            console.log("soy logistica")
            const rol = await Route.findOne({ defaults: false, type: 4 });
            get.rol = [...rol.route]
        }
        res.status(200).send({

            accessToken: jwt.CreateAcessToken(get),
            refresToken: jwt.CreateRefreshToken(get)

        })



    } catch (error) {
        CatchError(res, error)

    }

    // User.findOne({ email }, (err, userStored) => {
    //     if (err) {
    //         res.status(500).send({ message: "error del servidor" });
    //     }
    //     else {
    //         if (!userStored) {
    //             res.status(500).send({ message: "usuario no existe" });

    //         }
    //         else {
    //             bcrypt.compare(password, userStored.password, (err, check) => {
    //                 if (err) {
    //                     res.status(500).send({ message: "error del servidor" })

    //                 }
    //                 else {
    //                     if (!check) {
    //                         res.status(404).send({ message: "Contraseña incorrecta" })

    //                     }
    //                     else {
    //                         res.status(200).send({

    //                             accessToken: jwt.CreateAcessToken(userStored),
    //                             refresToken: jwt.CreateRefreshToken(userStored)

    //                         })
    //                     }

    //                 }

    //             })

    //         }
    //     }
    // }


    // );

}
function signUp(req, res) {
    const business = Authorization.business(req);
    const user = new User();
    const { email, password, repeatPassword, lastname, name, rol, establishment } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.rol = rol;
    user.establishment = establishment;
    user.seller = true;
    user.active = false;
    user.business = business;

    if (business) {


        if (!password || !repeatPassword) {
            res.status(404).send({ message: "las contraseñas son obligatoria" })

        }
        else {
            if (password !== repeatPassword) {
                res.status(404).send({ message: "las contraseñas no son iguales" })
            }
            else {
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        res.status(500).send({ message: err });
                    }
                    else {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) {

                                res.status(404).send({ message: "El email ya esta registrado" })
                                //res.status(500).send({ message: err })
                            }
                            else {
                                if (!userStored) {
                                    res.status(404).send({ message: "Error al crear usuario" })
                                }
                                else {
                                    res.status(200).send({ message: "Usuario creado correctamente" })
                                }
                            }

                        })
                    }

                }
                )

            }
        }

    }
    else {

        res.status(404).send({ message: "La firma electrónica esta modificado, cierre sessión" });
    }
}




async function GetUser(req, res) {
    const { business } = req.user;


    try {
        let get = await Models.aggregate(
            [

                { $match: { business: business, seller: true, deleted_at: null } },

                { $lookup: { from: 'rols', localField: 'rol', foreignField: '_id', as: 'rol', }, },
                { $unwind: { path: "$rol", "preserveNullAndEmptyArrays": true } },

                { $lookup: { from: 'establishments', localField: 'establishment', foreignField: '_id', as: 'establishment', }, },
                { $unwind: { path: "$establishment", "preserveNullAndEmptyArrays": true } },
                {
                    $project: {
                        _id: "$_id",
                        name: "$name",
                        lastname: "$lastname",
                        email: "$email",
                        establishment: {
                            _id: "$establishment._id",
                            name: "$establishment.name",
                        },
                        rol: {
                            _id: "$rol._id",
                            name: "$rol.name",
                        },
                        seller: "$seller"


                    }
                }

            ]
        )

        res.status(200).json(get);



    }
    catch (e) {
        res.status(404).send({ message: "error en la bd" });
        // next(e)
    }

}



function UpdateUser(req, res) {


    try {

        const { _id, email, password, repeatPassword, lastname, name, rol, establishment } = req.body;
        const filter = { _id: _id }

        User.findOne({ _id: _id },

            (err, userStored) => {
                if (err) {

                    res.status(500).send({ message: "error en el servidor" });
                }
                else {
                    if (!userStored) {
                        res.status(404).send({ message: "usuario no encontrado" });

                    }
                    else {



                        if (!password || !repeatPassword) {
                            res.status(404).send({ message: "las contraseñas son obligatoria" })

                        }
                        else {
                            if (password !== repeatPassword) {
                                res.status(404).send({ message: "las contraseñas no son iguales" })
                            }
                            else {
                                bcrypt.hash(password, 10, function (err, hash) {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                    }
                                    else {

                                        userStored.name = name;
                                        userStored.lastname = lastname;
                                        userStored.email = email;
                                        userStored.rol = rol;
                                        userStored.establishment = establishment;
                                        userStored.password = hash;
                                        userStored.business = Authorization.business(req);
                                        userStored.save().
                                            then(
                                                () => {
                                                    res.status(200).send({ message: "Datos modificado correctamente." });

                                                }
                                            ).
                                            catch((err => {

                                                res.status(404).send({ message: "El email ya existe." });
                                            }
                                            )

                                            );

                                    }

                                }
                                )

                            }
                        }




                    }
                }

            }
        );


    }

    catch (error) {
    }



}




function Registration(req, res) {

    const { name, lastname, email, password, repeatPassword, business: nameBussiness } = req.body




    const business = new Business();



    business.name = nameBussiness;


    const deleteBusiness = (_id) => {
        business.deleteOne({ _id: _id }, (err, stored) => {
            if (err) {
                // res.status(500).send({ message: err });

            }
            else {
                if (stored.deletedCount === 0) {

                    // res.status(400).send({ message: message });
                }
                else {
                    // res.status(404).send({ message: message });

                }

            }
        });
    }

    const deleteUser = (_id) => {
        User.deleteOne({ _id: _id }, (err, stored) => {
            if (err) {
                // res.status(500).send({ message: err });

            }
            else {
                if (stored.deletedCount === 0) {

                    // res.status(400).send({ message: message });
                }
                else {
                    // res.status(404).send({ message: message });

                }

            }
        });
    }





    business.save((err, stored) => {
        if (err) {

            res.status(404).send({ message: "El Nombre del negocio ya esta registrado" })
            // res.status(500).send({ message: err })
        }
        else {
            if (!stored) {
                res.status(404).send({ message: "Error al crear nombre del negocio" })
            }
            else {

                /////////// crear usuario
                const user = new User();
                const rol = new Rol();
                const { email, password, repeatPassword, lastname, name } = req.body;
                const idBusiness = stored._id;

                user.name = name;
                user.lastname = lastname;
                user.email = email;
                user.business = idBusiness;
                user.master = true;
                user.active = true;

                if (!password || !repeatPassword) {
                    res.status(404).send({ message: "las contraseñas son obligatoria" })

                }
                else {
                    if (password !== repeatPassword) {
                        res.status(404).send({ message: "las contraseñas no son iguales" })
                    }
                    else {
                        bcrypt.hash(password, 10, function (err, hash) {
                            if (err) {
                                res.status(500).send({ message: err });
                            }
                            else {
                                user.password = hash;
                                user.save((err, stored) => {
                                    if (err) {
                                        deleteBusiness(idBusiness, message = "El email ya esta registrado")
                                        res.status(400).send({ message: "El email ya esta registrado" });
                                    }
                                    else {
                                        if (!stored) {
                                            deleteBusiness(idBusiness, message = "Error al crear usuario")
                                            res.status(400).send({ message: "Error al crear usuario" });
                                        }
                                        else {
                                            const { _id: idUser } = stored

                                            res.status(200).send({ message: "Usuario creado correctamente" })


                                        }
                                    }

                                })
                            }

                        }
                        )

                    }
                }
                ///////////fin de crear usuario
            }
        }

    })
}

function Profile(req, res) {
    const idUser = Authorization.user(req);



    User.findOne({ '_id': idUser }, (err, stored) => {
        if (err) {
            res.status(404).send({ message: "usuario no encontrado." });
        }
        else {
            if (!stored) {
                res.status(404).send({ message: "usuario no encontrado." });

            }
            else {
                res.status(200).send(stored);
            }
        }

    }


    );
}
async function Buyer(req, res) {
    try {

        const user = new User(req.body);
        const productsCustom = new ProductsCustom();
        user.password = await bcrypt.hash(user.password, 10);
        user.buyer = true;
        console.log(user)
        productsCustom.user = user._id;
        if ((await Models.find({ email: user.email })).length > 0) throw { code: 404, message: `El usuario ${user.email}  existe.` }
        else
            if (user.save()) {
                productsCustom.save()
                res.status(200).send(user);
            }
            else throw { code: 404, message: `No se pudo dar de alta.` }


    } catch (error) {
        CatchError(res, error)

    }

}

async function Seller(req, res) {

}
async function Logistic(req, res) {
    try {

        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        user.logistic = true;

        if ((await Models.find({ email: user.email })).length > 0) throw { code: 404, message: `El usuario ${user.email}  existe.` }
        else
            if (user.save()) {
                res.status(200).send(user);
            }
            else throw { code: 404, message: `No se pudo dar de alta.` }


    } catch (error) {
        CatchError(res, error)

    }

}
module.exports = {
    signUp,
    GetUser,
    SingIn,
    FindUser,
    UpdateUser,
    DeleteUser,
    Registration,
    Profile,
    GetUserAdmin,
    AddSeller,
    UpdateSeller,
    FindUserMaster,
    Buyer,
    Seller,
    Logistic
};