const moongose = require("mongoose");
const Schema = moongose.Schema;

const BrandShema = Schema(
    {
        name: String,
        business: { type: Schema.Types.ObjectId, ref: "business" },
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("Brand", BrandShema) 