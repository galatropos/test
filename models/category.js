const moongose = require("mongoose");
const Schema = moongose.Schema;

const CategoryShema = Schema(
    {
        name: String,
        business: String
    }
)

module.exports = moongose.model("Category", CategoryShema)