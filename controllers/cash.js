
const Models = require("../models/cash");
const ModelsOutput = require("../models/output");
const ControlerProductAI = require("controllers/productsAI");
const Authorization = require("../services/Authorization");
const { CatchError } = require("../services/catchError");
const Moment = require("moment")
const mongoose = require('mongoose');
const output = require("../models/output");
const ObjectId = require('mongoose').Types.ObjectId;




async function Add(req, res) {
    const { name, ip } = req.body;
    const { business, establishment } = req.user;

    Model = new Models;
    Model.name = name;
    Model.ip = ip;
    Model.business = business
    Model.establishment = establishment

    try {
        const collection = await Models.findOne({ "business": business, "name": name, "establishment": establishment });
        if (collection) throw { code: 404, message: `Ya existe la caja ${name}` }

        const add = await Model.save()
        if (add) res.status(200).send({ add })
        else throw ({ add })



    }
    catch (error) {
        CatchError(res, error);

    }



}

function Get(req, res) {
    const { business, establishment } = req.user
    Models.find({ "business": business, "establishment": establishment })
        .then((stored) => {
            res.status(200).send(stored)
        })
        .catch((error) => {
            CatchError(res, error);
        })



}



async function Find(req, res) {
    const { params, user } = req
    const { establishment } = user
    const { id } = params
    try {
        const collection = await Models.findById(id)

        if (collection) {

            if (ObjectId(collection.establishment).toString() === ObjectId(establishment).toString())
                res.status(200).send(collection)
            else throw { code: 403, message: "No tienes permiso para modificar esta caja." }
        }
        else throw { code: 404, message: "Caja no encontrado." }



    } catch (error) {
        CatchError(res, error);
    }





}


async function Update(req, res) {
    const { params, body, user } = req;
    const { establishment, business } = user;
    const { _id, close, open } = body;

    try {
        const fin = await Models.findOne({ "_id": _id, "establishment": establishment })


        if (close) {
            if (Moment(open).isValid()) {
                let { output, open } = fin;
                output = output.map(({ _id, repayment, seller, name, product, cb, description, input, price, quantity, priceTotal, cash, ticket, amount, purchase }) => {
                    return ({
                        business: business,
                        establishment: establishment,
                        seller: seller,
                        name: name,
                        product: product,
                        cb: cb,
                        description: description,
                        input: input,
                        price: price,
                        quantity: quantity,
                        repayment: repayment,
                        cash: cash,
                        ticket: ticket,
                        amount: amount,
                        purchase: purchase,
                        open: open,
                        close: Moment().format(),

                    });
                })

                const addOutput = await ModelsOutput.insertMany([...output]);
                if (addOutput) {

                    req.body.open = null
                    req.body.output = []
                }

                else throw { code: 404, message: `No se pudo cerrar la caja..` }

            }
            else
                req.body.open = Moment().format()
        }

        if (body._id == params.id) {
            const update = await Models.findOneAndUpdate({ "_id": _id, "establishment": establishment }, body)


            if (update) {
                res.status(200).send({ old: update, new: body });
            }
            else throw { code: 404, message: `No se pudo modificar los datos.` }


        }

        else throw { code: 404, message: `Otro usuario modifico los datos.` }



    }

    catch (error) {
        CatchError(res, error)

    }



}



/////////////////////validation


async function OpenClose(req, res) {
    const { params, body } = req
    try {
        const collection = await Models.findOne({ "_id": body._id, "business": business });
        const collection1 = await Models.findOne({ "name": name, "business": business, "_id": { $ne: body._id } });

        if (params.id != body._id) throw { code: 406, message: `No se pudo modificar porque los datos a sido modificado por terceros ` }
        if (!collection) throw { code: 403, message: `No tienes permiso para eliminar el caja ${name} ` }
        if (collection1) throw { code: 404, message: `Ya existe la caja ${name} ` }
        if (output === "open") {
            const collection2 = await Models.findOneAndUpdate({ "_id": body._id }, { "output": { status: "Encendido" }, "open": dateOpen });
            if (collection2) {
                res.status(200).send({ message: `Caja abierta `, old: collection2, new: collection })
            }
            else throw { code: 404, message: `Otro usuario modifico los datos ` }

        }
        else if (output === "close") {
            res.status(200).send({ message: `Caja cerrada ` })


        }

        else {

            const collection4 = await Models.findOneAndUpdate({ "_id": body._id }, { "name": name });
            if (collection4) {
                res.status(200).send({ old: collection4, new: collection })
            }
            else throw { code: 404, message: `Otro usuario modifico los datos ` }
        }


    }

    catch (error) {
        CatchError(res, error)

    }



}



async function Delete(req, res) {
    const { id } = req.params.id
    const business = Authorization.business(req);

    try {
        const collection = await Models.findById(id)
        const collection1 = await Models.findOne({ "_id": id, "business": business })



        if (!collection) throw { code: 404, message: "No se pudo eliminar porque los datos no existe" }

        if (!collection1) throw { code: 403, message: `No tienes permiso para eliminar la caja ${collection.name} ` }

        const collection2 = await Models.deleteOne({ "_id": id })

        if (collection2) res.status(200).send(collection2)
        else throw { code: 404, message: "No se pudo eliminar." }


    } catch (error) {

        CatchError(res, error)

    }


}


async function Output(req, res) {
    try {

        let { output, mount, cash_id } = req.body;
        const { establishment, _id, business } = req.user
        ticket = ObjectId();
        let data = []
        i = 0
        for (const key in output) {
            data[i] = {
                ticket: ticket,
                product: ObjectId(key),
                quantity: output[key].quantity,
                price: output[key].price,
                input: output[key].input,
                mount: mount,
                cash: ObjectId(cash_id),
                seller: _id,
                business: business,
                establishment: establishment,
                purchase: Moment().format()


            }
            i++
        }
        const productsAI = await ControlerProductAI.ProductAI(establishment)
        let total = 0
        // console.log(productsAI)

        data.forEach(element => {
            const find = productsAI.find(find => find._id.toString() === element.product.toString())
            if (find.stock < element.quantity)
                throw { code: 404, message: `${find.product.name}(${find.product.cb}): solo existe ${find.stock} en el inventario.` }
            total = element.price + total;
        });

        if (total > mount)
            throw { code: 404, message: `El importe(${mount}) es menor que la compra(${total}).` }
        // console.log(total)

        const update = await Models.findByIdAndUpdate({ "_id": cash_id }, { $push: { "output": data } })
        console.log(update)

        if (update) {
            throw { code: 404, message: `Cambio $${mount - total}` }

            // res.status(200).send({ message: `Cambio $${mount - total}` })
        }
        throw { code: 404, message: `Error al hacer la transación.` }

        console.log(data)

        // console.log(req.body)
        // if (_id === req.params.id) {
        //     let total = output.map(({ priceTotal }) => priceTotal)
        //     total = total.reduce((a, b) => a + b);
        //     cambio = amount - total;
        //     if (cambio < 0)
        //         throw { code: 404, message: `falta ${-1 * cambio}` }
        //     output = output.map((output) => {
        //         return ({
        //             ...output,
        //             ticket: ticket,
        //             amount: amount,
        //             seller: seller,
        //             purchase: Moment().format()
        //         })
        //     })
        //     const update = await Models.findByIdAndUpdate({ "_id": _id }, { $push: { "output": output } })

        //     if (update) {
        //         res.status(200).send({ message: `cambio:${req.body.exchange}` })
        //     }
        //     else throw { code: 404, message: "No se encontro la caja." }

        // }
        // else throw { code: 404, message: "Datos modificados por terceros." }

    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }

}

async function InputCash(req, res) {
    const { body, params } = req
    const { id } = params
    try {
        const find = await Models.findOne({ _id: id })

        if (Moment(find.open).isValid()) {

            const get = await Models
                .aggregate(
                    [
                        { $match: { _id: new ObjectId(id) } },


                        { $unwind: { path: "$output", "preserveNullAndEmptyArrays": true } },

                        { $replaceRoot: { newRoot: "$output" } },

                        { $lookup: { from: 'users', localField: 'seller', foreignField: '_id', as: 'seller', }, },
                        { $unwind: { path: "$seller", "preserveNullAndEmptyArrays": true } },


                        { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product', }, },
                        { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },

                        { $lookup: { from: 'establishments', localField: 'seller.establishment', foreignField: '_id', as: 'seller.establishment', }, },
                        { $unwind: { path: "$seller.establishment", "preserveNullAndEmptyArrays": true } },


                        {
                            $group: {
                                _id: "$ticket",
                                ticket: { $first: "$ticket" },
                                quantityTotal: { $sum: "$quantity" },
                                importTotal: { $sum: { $multiply: ["$quantity", "$price"] } },
                                // { $convert: { input: "$quantity", to: "double" } }
                                purchase: { $first: "$purchase" },
                                amount: { $first: "$amount" },
                                seller: {
                                    $first:
                                    {
                                        "_id": "$seller._id",
                                        "name": "$seller.name",
                                        "lastname": "$seller.lastname",
                                        "email": "$seller.email",
                                        "establishment": "$seller.establishment",

                                    }
                                },
                                children:
                                {
                                    $addToSet:
                                    {
                                        productOrigin: "$product",
                                        name: "$name",
                                        description: "$description",
                                        price: { $convert: { input: "$price", to: "double" } },
                                        quantity: { $convert: { input: "$quantity", to: "double" } },
                                        Totalquantity: { $convert: { input: { $multiply: ["$price", "$quantity"] }, to: "double" } },

                                    }
                                }

                            }

                        },
                        {
                            $project: {
                                _id: "$_id",
                                ticket: "$ticket",
                                quantityTotal: "$quantityTotal",
                                importTotal: { $convert: { input: "$importTotal", to: "double" } },
                                purchase: "$purchase",
                                amount: "$amount",
                                seller: "$seller",
                                children: "$children"
                            }
                        },
                        { $sort: { _id: -1 } },




                    ]
                );

            res.status(200).send(get)
        }
        else throw { code: 403, message: `Caja cerrada.` }






    } catch (error) {
        CatchError(res, error)

    }
}


async function GetRepayment(req, res) {
    try {
        const id = ObjectId(req.params.id);
        const ticket = ObjectId(req.params.ticket);

        const get = await Models
            .aggregate([
                {
                    $match: { _id: id, },

                },
                { $unwind: { path: "$output", "preserveNullAndEmptyArrays": true } },
                { $replaceRoot: { newRoot: "$output" } },
                { $match: { ticket: ticket } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' }, },
                { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },
                {
                    $project: {
                        _id: "$_id",
                        amount: "$amount",
                        description: "$description",
                        input: "$input",
                        name: "$name",
                        price: { $convert: { input: "$price", to: "int" } },
                        product: "$product",
                        purchase: "$purchase",
                        quantity: "$quantity",
                        seller: "$seller",
                        ticket: "$ticket",
                        cb: "$cb",
                        repayment: "$repayment",



                    }

                }

            ])
        res.status(200).send(get)



    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }

}
async function patchRepayment(req, res) {
    try {
        let { body, params } = req;
        const id = ObjectId(params.id);
        const ticket = ObjectId(params.ticket);

        // console.log(id)
        // console.log(ticket)
        // console.log(body)
        const get = await Models
            .aggregate([
                {
                    $match: { _id: id, },

                },
                { $unwind: { path: "$output", "preserveNullAndEmptyArrays": true } },
                { $replaceRoot: { newRoot: "$output" } },
                { $match: { ticket: ticket } },


            ])

        body = body.filter(e => e.repayment > 0)

        body = body.map(body => {
            const { seller, name, product, cb, description, input, price, amount } = get.find(e => e._id.toString() === body._id)
            return (
                {
                    seller: seller,
                    name: name,
                    product: product,
                    cb: cb,
                    description: description,
                    input: input,
                    price: price,
                    quantity: 0,
                    repayment: body.repayment,
                    cash: id,
                    ticket: ticket,
                    amount: amount,
                    purchase: Moment().format(),
                }

            )
        })
        const update = await Models.findByIdAndUpdate({ "_id": id }, { $push: { "output": body } })

        const getupdate = await Models
            .aggregate([
                {
                    $match: { _id: id, },

                },
                { $unwind: { path: "$output", "preserveNullAndEmptyArrays": true } },
                { $replaceRoot: { newRoot: "$output" } },
                { $match: { ticket: ticket } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' }, },
                { $unwind: { path: "$product", "preserveNullAndEmptyArrays": true } },
                {
                    $project: {
                        _id: "$_id",
                        amount: "$amount",
                        description: "$description",
                        input: "$input",
                        name: "$name",
                        price: { $convert: { input: "$price", to: "int" } },
                        product: "$product",
                        purchase: "$purchase",
                        quantity: "$quantity",
                        seller: "$seller",
                        ticket: "$ticket",
                        cb: "$cb",


                    }

                }

            ])
        res.status(200).send(getupdate)




    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }

}
module.exports = {
    Add, Get, Update, Delete, Find, OpenClose, Output, InputCash, GetRepayment, patchRepayment
};

