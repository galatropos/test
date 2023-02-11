
const Collection = require("../models/route");
const Models = require("../models/route");
const { CatchError } = require("../services/catchError");


function GetRouteDefault(req, res) {


    Collection.findOne({ 'defaults': false, type: 1 }, (err, stored) => {
        if (err) {
            res.status(404).send({ message: "route no encontrado." });
        }
        else {
            if (!stored) {
                res.status(404).send({ message: "route no encontrado." });

            }
            else {
                res.status(200).send(stored);

            }
        }

    }


    );
}


function GetRoute(req, res) {
    const type = Number(req.params.type);


    Collection.findOne({ type: type, defaults: false }, (err, stored) => {
        if (err) {
            res.status(404).send({ message: "route no encontrado." });
        }
        else {
            if (!stored) {
                res.status(404).send({ message: "route no encontrado." });

            }
            else {
                res.status(200).send(stored);

            }
        }

    }


    );
}

function UpdateRoute(req, res) {

    try {

        const { body: route } = req;


        Collection.findOne({ defaults: false },

            (err, store) => {
                if (err) {

                    res.status(500).send({ message: "error en el servidor" });
                }
                else {
                    if (!store) {
                        res.status(404).send({ message: "Route no encontrado" });

                    }
                    else {

                        store.route = route;
                        store.save().
                            then(
                                () => {
                                    res.status(200).send({ message: "Ruta Creado correctamente." });

                                }
                            ).
                            catch((err => {

                                res.status(404).send({ message: "El route ya existe." });
                            }
                            )

                            );




                    }
                }

            }
        );


    }

    catch (error) {
    }



}

async function backup(req, res) {
    try {
        const type = Number(req.params.type)
        const slave = await Collection.findOne({ 'defaults': false, type: type });
        const master = await Collection.findOneAndUpdate({ 'defaults': true, type: type }, { "route": slave.route });


        res.status(200).send({ message: "Datos respaldado." });
    } catch (error) {

        CatchError(res, error);
    }
}

async function restore(req, res) {
    try {
        const type = Number(req.params.type)
        const master = await Collection.findOne({ 'defaults': true, type: type });
        const slave = await Collection.findOneAndUpdate({ 'defaults': false, type: type }, { "route": master.route });


        res.status(200).send({ message: "Datos restaurados." });
    } catch (error) {

        CatchError(res, error);
    }
}
async function findCut(req, res) {
    id = JSON.parse(`[${req.params.id}]`)
    type = Number(req.params.type)

    const find = await Models.findOne({ defaults: false, type: type })
    const { route } = find;

    switch (id.length) {
        case 1:
            res.status(200).send(route[id[0]]);
            break;
        case 2:
            res.status(200).send(route[id[0]].routes[id[1]]);
            break;
        case 3:
            res.status(200).send(route[id[0]].routes[id[1]].routes[id[2]]);
            break;
        default:
            res.status(404).send({ message: "no encontrado" });

            break;
    }

}


async function update(req, res) {
    id = req.params.id.split(',')
    type = Number(req.params.type)

    let find = await Models.findOne({ defaults: false, type: type })

    switch (id.length) {
        case 1:
            find.route[id[0]] = {
                ...find.route[id[0]],
                ...req.body

            }
            break;
        case 2:
            find.route[id[0]].routes[id[1]] = {
                ...find.route[id[0]].routes[id[1]],
                ...req.body

            }
            break;
        case 3:
            find.route[id[0]].routes[id[1]].routes[id[2]] = {
                ...find.route[id[0]].routes[id[1]].routes[id[2]],
                ...req.body

            }
            break;
        default:
            res.status(404).send({ message: "no encontrado" });

            break;
    }

    const update = await Models.findOneAndUpdate({ defaults: false, type: type }, find)

    if (update)
        res.status(200).send({ old: update, new: find });
    else
        res.status(404).send({ message: "La ruta no fue modificado" });

}

async function add(req, res) {

    id = req.params.id.split(',');
    type = Number(req.params.type);

    let find = await Models.findOne({ defaults: false, type: type });

    switch (id.length) {
        case 1:
            if (id[0] === "-1")
                find.route.push({ ...req.body });
            else
                find.route[id[0]].routes.push(req.body);
            break;
        case 2:
            find.route[id[0]].routes[id[1]].routes.push(req.body);
            break;
        case 3:
            find.route[id[0]].routes[id[1]].routes[id[2]].push(req.body);
            break;
        default:
            res.status(404).send({ message: "no encontrado" });

            break;
    }

    const update = await Models.findOneAndUpdate({ defaults: false, type: type }, find)

    if (update)
        res.status(200).send({ old: update, new: find });
    else
        res.status(404).send({ message: "La ruta no fue modificado" });

}

async function deleteRoute(req, res) {
    id = req.params.id.split(',')
    console.log(id)
    const type = Number(req.params.type)
    let newFin = []
    let find = await Models.findOne({ defaults: false, type: type })
    switch (id.length) {
        case 1:
            newFin = find.route.splice([id[0]], 1)
            break;
        case 2:
            newFin = find.route[id[0]].routes.splice(id[1], 1);
            break;
        case 3:
            newFin = find.route[id[0]].routes[id[1]].routes.splice(id[2], 1);
            break;
        default:
            res.status(404).send({ message: "no encontrado" });

            break;
    }
    const update = await Models.findOneAndUpdate({ defaults: false, type: type }, find)

    if (update)
        res.status(200).send({ message: "Ruta eliminado correctamente.", stored: newFin });
    else
        res.status(404).send({ message: "La ruta no fue modificado" });


}

async function sort(req, res) {
    const type = Number(req.params.type)
    const update = await Models.findOneAndUpdate({ defaults: false, type }, { route: req.body })
    if (update)
        res.status(200).send({ message: "Se movio correctament." });
    else
        res.status(404).send({ message: "Hubo un error" });

}
module.exports = {
    UpdateRoute, GetRoute, GetRouteDefault, backup, findCut, update, add, deleteRoute, restore, sort
};