const moongose = require("mongoose");
const Schema = moongose.Schema;

const ProviderShema = Schema(
    {
        name: String,
        lastname: String,
        businessProvider: String,
        state: String,
        municipality: String,
        location: String,
        direction: String,
        email: String,
        phone: String,
        web: String,
        reference: String,
        business: { type: Schema.Types.ObjectId, ref: "business" },
        establishment: { type: Schema.Types.ObjectId, ref: "establishment" },
        created_at: { type: Date, required: true, default: Date.now },
        deleted_at: { type: Date, default: null },

    }
)

module.exports = moongose.model("Provider", ProviderShema)