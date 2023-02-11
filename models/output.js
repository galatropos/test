const moongose = require("mongoose");
const Schema = moongose.Schema;

const OutputShema = Schema(
    {
        cash: { type: Schema.Types.ObjectId, ref: "cash" },
        seller: { type: Schema.Types.ObjectId, ref: "User" },
        product: { type: Schema.Types.ObjectId, ref: "Products" },
        establishment: { type: Schema.Types.ObjectId, ref: "establishment" },
        business: { type: Schema.Types.ObjectId, ref: "business" },
        ticket: { type: Schema.Types.ObjectId },
        name: { type: String },
        cb: { type: String },
        description: { type: String },
        input: { type: Number },
        price: { type: String },
        quantity: { type: Number, default: 0 },
        repayment: { type: Number, default: 0 },
        amount: { type: String },
        purchase: { type: Date },
        input: { type: Number },
        open: { type: Date },
        close: { type: Date },
    }
)

module.exports = moongose.model("Output", OutputShema) 