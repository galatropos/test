const moongose = require("mongoose");
const Schema = moongose.Schema;

const CashShema = Schema(
    {
        name: String,
        ip: String,
        output:
            [
                {


                    seller: { type: Schema.Types.ObjectId, ref: "User" },
                    product: { type: Schema.Types.ObjectId, ref: "Product" },
                    price: { type: Schema.Types.Decimal128, },
                    input: { type: Schema.Types.Decimal128, },
                    quantity: { type: Number, default: 0 },
                    repayment: { type: Number, default: 0 },
                    cash: { type: Schema.Types.ObjectId, ref: "Cash" },
                    ticket: { type: Schema.Types.ObjectId },
                    amount: { type: Schema.Types.Decimal128 },
                    purchase: Date,
                },


            ],



        open: {
            type: Date,
        },
        business: String,
        establishment: { type: Schema.Types.ObjectId, ref: "Establishment" },
    }
)

module.exports = moongose.model("Cash", CashShema) 