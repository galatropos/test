const moongose = require("mongoose");
const Schema = moongose.Schema;

const ProductsCustomShemaShema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "users" },
        cart: { type: Object, default: {} },
        favorite: { type: Object, default: {} }
    }
)

module.exports = moongose.model("ProductsCustom", ProductsCustomShemaShema)