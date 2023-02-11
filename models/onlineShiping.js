const moongose = require("mongoose");
const Schema = moongose.Schema;

const OnlineShippingShema = Schema(
    {
        address: { type: Schema.Types.ObjectId, ref: "address" },
        user: { type: Schema.Types.ObjectId, ref: "users" },
        shipping: { type: Schema.Types.ObjectId, ref: "shippings" },
        price: { type: Schema.Types.Decimal128, default: 0, },
        created_at: { type: Date, required: true, default: Date.now },
    }
)

module.exports = moongose.model("OnlineShipping", OnlineShippingShema) 