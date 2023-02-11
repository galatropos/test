const moongose = require("mongoose");
const Schema = moongose.Schema;

const WordShema = Schema(
    {
        name: {
            type: String,
            unique: true
        },
    }
)

module.exports = moongose.model("Word", WordShema)