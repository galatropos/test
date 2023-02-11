const moongose = require("mongoose");
const Schema = moongose.Schema;

const RouteShema = Schema(
    {
        defaults: Boolean,
        type: Number,
        route:
        {
            default: [],
            type: [
                {
                    name: String,
                    element: String,
                    icons: String,
                    key: String,
                    path: String,
                    routes:
                    {
                        default: [],
                        type: [
                            {
                                name: String,
                                path: String,
                                key: String,
                                routes:
                                {
                                    default: [],
                                    type: [
                                        {
                                            name: String,
                                            path: String,
                                            element: String,
                                            key: String,
                                            index: String,
                                        }
                                    ]
                                }
                            }

                        ]
                    }
                },


            ],
        }
    }
)

module.exports = moongose.model("Route", RouteShema)