
const Models = require("models/productsCustom");
const { CatchError } = require("services/catchError");




async function FindCart(req, res) {
    try {
        const { _id: user, } = req.user;

        const { cart } = await Models.findOne({ user: user });
        res.status(200).send(cart)

    } catch (error) {
        CatchError(res, error)

    }



}

async function AddCarts(req, res) {
    try {
        const { _id: user } = req.user;
        const { products } = req.body;
        console.log(req.body)
        let { cart } = await Models.findOne({ user: user });

        if (cart[products]) ++cart[products];
        else cart[products] = 1;

        const update = await Models.updateOne({ user: user }, { cart })

        res.status(200).send(cart)

    } catch (error) {
        CatchError(res, error)

    }



}


async function SelectCarts(req, res) {
    try {
        const { _id: user } = req.user;
        const { products, value } = req.body;
        console.log(req.body)
        let { cart } = await Models.findOne({ user: user });
        if (value < 1)
            delete (cart[products])
        else
            cart[products] = value

        const update = await Models.updateOne({ user: user }, { cart })

        res.status(200).send(cart)

    } catch (error) {
        CatchError(res, error)

    }



}



async function DeleteCarts(req, res) {
    try {
        const { _id: user } = req.user;
        const { products } = req.params;

        let { cart } = await Models.findOne({ user: user });

        if (cart[products]) --cart[products];

        if (cart[products] < 1)
            delete (cart[products])


        const update = await Models.updateOne({ user: user }, { cart })

        res.status(200).send(cart)

    } catch (error) {
        CatchError(res, error)

    }



}


module.exports = {
    AddCarts,
    FindCart,
    DeleteCarts,
    SelectCarts
};