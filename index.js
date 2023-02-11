require('module-alias/register');
const mongoose = require("mongoose");
const app = require("./app");
const PORT_SERVER = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB, DATABASE } = require("./config");


// getting-started.js


main().catch(err => console.log(err));

async function main() {
    //mongoose.set("useFindAndModify", false);
    await mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/${DATABASE}`,
        { useNewUrlParser: true }, (err, res) => {
            if (err) {
                console.log("err");
                throw err;
            }
            else {
                console.log("coneccion db conenctado")
                app.listen(PORT_SERVER, () => {
                    console.log("###################");
                    console.log("#### APPI REST ####");
                    console.log("###################");
                    console.log(`HTTP://${(IP_SERVER)}:${PORT_SERVER}/api/${API_VERSION}/`);
                })
            }
        });
}