const moongose = require("mongoose");
const Schema = moongose.Schema;

const OutputOnlineShema = Schema(
    {
        establishment: { type: Schema.Types.ObjectId, ref: "establishment" },
        addressSeller: { type: Schema.Types.ObjectId, ref: "adresses" },
        business: { type: Schema.Types.ObjectId, ref: "business" },
        logistic: { type: Schema.Types.ObjectId, ref: "users" },
        addressLogistic: { type: Schema.Types.ObjectId, ref: "adresses" },
        buyer: { type: Schema.Types.ObjectId, ref: "users" },
        addressBuyer: { type: Schema.Types.ObjectId, ref: "adresses" },
        order: { type: Schema.Types.ObjectId, ref: "online" },
        orderShipping: { type: Schema.Types.ObjectId, ref: "onlineShipping" },
        price: { type: Schema.Types.Decimal128 },
        quantity: { type: Number, default: 0 },
        repayment: { type: Number, default: 0 },
        priceShipping: { type: Schema.Types.Decimal128 },
        payment: { type: Number },
        product: { type: Schema.Types.ObjectId, ref: "Products" },
        ticket: { type: Schema.Types.ObjectId },
        name: { type: String },
        cb: { type: String },
        word: { type: String },
        recive: { type: String },
        description: { type: String },
        purchase: { type: Date },
        accept_logistic: { type: Date, default: null },
        accept_seller: { type: Date, default: null },
        deleted_at: { type: Date, default: null },
        finish_at: { type: Date, default: null },
        deleted_type: String,
    }
)

module.exports = moongose.model("OutputOnline", OutputOnlineShema) 