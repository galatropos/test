const moongose = require("mongoose");
const Schema = moongose.Schema;

const UserShema = Schema(
    {
        name: String,
        lastname: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        rol: {
            type: Schema.Types.ObjectId, ref: "Rol"
        },
        establishment: { type: Schema.Types.ObjectId, ref: "Establishment" },
        phone: String,
        master: Boolean,
        root: Boolean,
        buyer: Boolean,
        logistic: Boolean,
        business: { type: Schema.Types.ObjectId, ref: "business" },
        active: Boolean,
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },
    }
)

module.exports = moongose.model("User", UserShema)