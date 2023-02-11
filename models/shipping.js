const moongose = require("mongoose");
const Schema = moongose.Schema;

const ShippingShema = Schema(
    {
        name: String,
        lastname: String,
        phone: String,
        active: { type: Boolean, default: false },
        establishment: { type: Schema.Types.ObjectId, ref: "establishment" },
        user: { type: Schema.Types.ObjectId, ref: "user" },
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("Shipping", ShippingShema) 