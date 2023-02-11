const moongose = require("mongoose");
const Schema = moongose.Schema;

const AddressShema = Schema(
    {
        name: String,
        user: { type: Schema.Types.ObjectId, ref: "users" },
        lat: { type: Schema.Types.Decimal128 },
        lng: { type: Schema.Types.Decimal128 },
        ZIP: { type: Number },
        state: String,
        municipality: String,
        locality: String,
        address: String,
        reference: String,
        numExt: Number,
        numInt: Number,
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("Address", AddressShema) 