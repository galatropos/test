const moongose = require("mongoose");
const Schema = moongose.Schema;

const OnlineShema = Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: "products" },
        price: { type: Schema.Types.Decimal128, default: 0, },
        establishment: { type: Schema.Types.ObjectId, ref: "establishments" },
        business: { type: Schema.Types.ObjectId, ref: "businesses" },
        type: Number,
        status: { type: Number, default: 0 },
        shipping: Number,
        created_at: { type: Date, required: true, default: Date.now },
    }
)

module.exports = moongose.model("Online", OnlineShema) 