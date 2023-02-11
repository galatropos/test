const moongose = require("mongoose");
const Schema = moongose.Schema;

const EstablishmentShema = Schema(
    {
        name: String,
        business: { type: Schema.Types.ObjectId, ref: "business" },
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
        address: { type: Schema.Types.ObjectId, ref: "adresses" },
    }
)

module.exports = moongose.model("Establishment", EstablishmentShema) 