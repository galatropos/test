const moongose = require("mongoose");
const Schema = moongose.Schema;

const BusinessShema = Schema(
    {
        name: {
            type: String,
            unique: true
        },
    }
)

module.exports = moongose.model("Business", BusinessShema)