const moongose = require("mongoose");
const Schema = moongose.Schema;

const ProductsShema = Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        sales: Number,
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("Products", ProductsShema)