
const Models = require("models/brand");
const ModelsProducts = require("models/products");
const ModelsCash = require("models/cash");
const ModelsSupplies = require("models/supplies");
const ModelsOutput = require("models/output");
const ModelsOutputOnline = require("models/outputOnline");
const ModelsMarket = require("models/market");
const { CatchError } = require("services/catchError");

async function ProductAI(establishment) {
    try {

        let outputOnline = await ModelsOutputOnline.aggregate([
            { $match: { establishment: establishment } },
            {
                $group: {
                    _id: "$product",
                    outputOnlineO: { $sum: { "$cond": [{ "$eq": ["$deleted_at", null] }, "-$quantity", "$quantity"] } },
                    outputOnlineI: { $sum: "$quantity" },
                    outputOnlineIO: { $sum: "$quantity" },
                }
            }
        ])

        let products = await ModelsProducts.aggregate([
            {
                $group: {
                    _id: "$_id",
                    product: {
                        $addToSet: {
                            _id: "$_id",
                            name: "$name",
                            cb: "$cb",
                            brand: "$brand",
                            business: "$business",
                            price: { $convert: { input: "$price", to: "double" } },
                            description: "$description",
                            category: "$category",
                            subcategory: "$subcategory",
                            model: "$model",
                            feactures: "$feactures",
                            image: "$image",

                        }
                    },
                },

            },
            { $unwind: "$product", }

        ])
        const cash = await ModelsCash
            .aggregate(
                [
                    { $match: { establishment: establishment } },
                    {
                        $project: {
                            _id: "$_id",
                            output: {
                                $map: {
                                    input: '$output',
                                    as: 'kv',
                                    in: {
                                        product: '$$kv.product',
                                        cashI: '$$kv.quantity',
                                        cashO: '$$kv.repayment',
                                    },
                                }
                            }
                        }
                    },

                    { $unwind: "$output" },
                    { $replaceRoot: { newRoot: "$output" } },
                    {
                        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$output", 0] }, "$$ROOT"] } }
                    },
                    {
                        $group: {
                            _id: "$product",
                            cashI: { $sum: "$cashI" },
                            cashO: { $sum: "$cashO" }
                        }
                    },
                    { $match: { _id: { $ne: null } } },

                    { $sort: { product: -1 } },

                ]
            );

        const supplies = await ModelsSupplies
            .aggregate([
                { $match: { establishment: establishment } },
                {
                    $group: {
                        _id: "$products",
                        suppliesI: { $sum: "$input" },
                        suppliesO: { $sum: "$output" },
                    }
                }
            ])

        const output = await ModelsOutput
            .aggregate(
                [
                    { $lookup: { from: 'cashes', localField: 'cash', foreignField: '_id', as: 'cash', }, },
                    { $unwind: { path: "$cash", "preserveNullAndEmptyArrays": true } },
                    { $match: { establishment: establishment } },

                    {
                        $group: {
                            _id: "$product",
                            salesI: { $sum: "$quantity" },
                            salesO: { $sum: "$repayment" },
                        }
                    }
                ]
            )
        let merge = output.concat(supplies, cash, output, products, outputOnline)
        let merge2 = Object()
        merge.forEach((element, i) => {

            merge2[element._id] = {
                ...merge2[element._id], ...element
            }

        });
        merge = Object.values(merge2);
        merge = merge.filter(e => e.suppliesI >= 0)
        merge = merge.map((e => {
            let stock = 0;
            if (e.hasOwnProperty("suppliesI")) stock = e.suppliesI
            else e.suppliesI = 0;

            if (e.hasOwnProperty("suppliesO")) stock = stock - e.suppliesO
            else e.suppliesO = 0;

            if (e.hasOwnProperty("cashI")) stock = stock - e.cashI
            else e.cashI = 0;

            if (e.hasOwnProperty("cashO")) stock = stock + e.cashO
            else e.cashO = 0;

            if (e.hasOwnProperty("salesI")) stock = stock - e.salesI
            else e.salesI = 0;

            if (e.hasOwnProperty("salesO")) stock = stock + e.salesO
            else e.salesO = 0;

            if (e.hasOwnProperty("outputOnlineI")) stock = stock - e.outputOnlineI
            else e.outputOnlineI = 0;

            if (e.hasOwnProperty("outputOnlineO")) stock = stock + e.outputOnlineO
            else e.outputOnlineO = 0;


            return ({ ...e, stock })
        })
        )
        return (merge)
        res.status(200).send(merge)



    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }
}


async function ProductAIByOne(_id) {
    try {
        let products = await ModelsProducts.aggregate([
            {

                $group: {
                    _id: "$_id",
                    product: {
                        $addToSet: {
                            _id: "$_id",
                            name: "$name",
                            cb: "$cb",
                            brand: "$brand",
                            business: "$business",
                            price: { $convert: { input: "$price", to: "double" } },
                            description: "$description",
                            category: "$category",
                            subcategory: "$subcategory",
                            model: "$model",
                            feactures: "$feactures",
                            image: "$image",

                        }
                    },
                },

            },
            { $unwind: "$product", },
            { $match: { _id: _id } }

        ])
        products = products[0]

        const cash = await ModelsCash
            .aggregate(
                [
                    {
                        $project: {
                            _id: "$_id",
                            output: {
                                $map: {
                                    input: '$output',
                                    as: 'kv',
                                    in: {
                                        product: '$$kv.product',
                                        cashI: '$$kv.quantity',
                                        cashO: '$$kv.repayment',
                                    },
                                }
                            }
                        }
                    },

                    { $unwind: "$output" },
                    { $replaceRoot: { newRoot: "$output" } },
                    {
                        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$output", 0] }, "$$ROOT"] } }
                    },
                    {
                        $group: {
                            _id: "$product",
                            cashI: { $sum: "$cashI" },
                            cashO: { $sum: "$cashO" }
                        }
                    },
                    { $match: { _id: { $ne: null } } },
                    { $match: { _id: _id } },

                    { $sort: { product: -1 } },

                ]
            );
        const supplies = await ModelsSupplies
            .aggregate([
                { $match: { products: _id } },
                {
                    $group: {
                        _id: "$products",
                        suppliesI: { $sum: "$input" },
                        suppliesO: { $sum: "$output" },
                    }
                }
            ])

        const output = await ModelsOutput
            .aggregate(
                [
                    { $lookup: { from: 'cashes', localField: 'cash', foreignField: '_id', as: 'cash', }, },
                    { $unwind: { path: "$cash", "preserveNullAndEmptyArrays": true } },
                    { $match: { product: _id } },

                    {
                        $group: {
                            _id: "$product",
                            salesI: { $sum: "$quantity" },
                            salesO: { $sum: "$repayment" },
                        }
                    }
                ]
            )



        let outputOnline = await ModelsOutputOnline.aggregate([
            { $match: { product: _id } },
            {
                $group: {
                    _id: "$product",
                    outputOnlineO: { $sum: { "$cond": [{ "$eq": ["$deleted_at", null] }, "-$quantity", "$quantity"] } },
                    outputOnlineI: { $sum: "$quantity" },
                    outputOnlineIO: { $sum: "$quantity" },
                }
            }
        ])

        let merge = output.concat(supplies, cash, output, products, outputOnline)
        let merge2 = Object()
        merge.forEach((element, i) => {

            merge2[element._id] = {
                ...merge2[element._id], ...element
            }

        });

        merge = Object.values(merge2);
        merge = merge.filter(e => e.suppliesI >= 0)
        merge = merge.map((e => {
            let stock = 0;
            if (e.hasOwnProperty("suppliesI")) stock = e.suppliesI
            else e.suppliesI = 0;

            if (e.hasOwnProperty("suppliesO")) stock = stock - e.suppliesO
            else e.suppliesO = 0;

            if (e.hasOwnProperty("cashI")) stock = stock - e.cashI
            else e.cashI = 0;

            if (e.hasOwnProperty("cashO")) stock = stock + e.cashO
            else e.cashO = 0;

            if (e.hasOwnProperty("salesI")) stock = stock - e.salesI
            else e.salesI = 0;

            if (e.hasOwnProperty("salesO")) stock = stock + e.salesO
            else e.salesO = 0;

            if (e.hasOwnProperty("outputOnlineI")) stock = stock - e.outputOnlineI
            else e.outputOnlineI = 0;

            if (e.hasOwnProperty("outputOnlineO")) stock = stock + e.outputOnlineO
            else e.outputOnlineO = 0;

            return ({ ...e, stock })
        })
        )
        return (merge[0])

        res.status(200).send(merge)



    } catch (error) {
        console.log(error)
        CatchError(101, error)

    }
}

async function GetSell(req, res) {
    const { establishment } = req.user
    try {
        let products = await ModelsMarket.aggregate([
            { $match: { establishment } },
            {
                $project: {
                    _id: "$product",
                    price: { $convert: { input: "$price", to: "double" } },
                }
            }
        ]);

        const stock = await ProductAI(establishment);
        const result = products.map(({ _id, price }, le) => {
            let find = stock.find((f) => f._id.toString() === _id.toString());
            console.log(_id)
            console.log(find?._id)

            if (find) find.product.price = price;
            return (find)
        })

        res.status(200).send(result)


    } catch (error) {
        console.log(error)
        CatchError(res, error)

    }



}


async function Get(req, res) {
    const { establishment } = req.user
    try {
        res.status(200).send(await ProductAI(establishment))

    } catch (error) {
        CatchError(res, error)

    }



}





module.exports = {
    Get, ProductAI, GetSell, ProductAIByOne
};