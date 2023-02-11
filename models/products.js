const moongose = require("mongoose");
const Schema = moongose.Schema;

const ProductsShema = Schema(
    {
        name: String,
        image: Array,
        cb: String,
        business: { type: Schema.Types.ObjectId, ref: "Business" },
        brand: { type: Schema.Types.ObjectId, ref: "Brand" },
        provider: { type: Schema.Types.ObjectId, ref: "Provider" },
        price: { type: Schema.Types.Decimal128, default: 0, },
        description: String,
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        subcategory: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        model: String,
        features: Array,
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("Products", ProductsShema)