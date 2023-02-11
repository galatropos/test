const moongose = require("mongoose");
const Schema = moongose.Schema;

const SuppliesShema = Schema(
    {
        products: {
            type: Schema.Types.ObjectId, ref: "Products",
            require: true,
        },
        price: {
            type: Schema.Types.Decimal128,
            default: 1,
        },
        input: {
            type: Number,
            default: 0,
        },
        output: {
            type: Number,
            default: 0,

        },
        expiration: {
            type: Date,
        }
        ,
        description: String,
        business: {
            type: Schema.Types.ObjectId, ref: "business",
            require: true,
        },
        establishment: {
            type: Schema.Types.ObjectId, ref: "establishment",
            require: true,
        },
    }
)
SuppliesShema.set('toJSON', {
    getters: true,
    transform: (doc, ret) => {
        if (ret.products.price)
            ret.products.price = ret.products.price.toString()

        delete ret.id;
        delete ret.__v;
        return ret;
    },
});

module.exports = moongose.model("Supplies", SuppliesShema) 