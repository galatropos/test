const moongose = require("mongoose");
const Schema = moongose.Schema;

const RolShema = Schema(
    {
        name: String,
        permission: { type: Array, default: [] },
        matriz: { type: Array, default: [] },
        business: { type: Schema.Types.ObjectId, ref: "business" },
    }
)

module.exports = moongose.model("Rol", RolShema)