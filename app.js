const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

const { API_VERSION } = require("./config");

/// routing
const authRoutes = require("./routers/auth")
const root = require("./routers/root/root");
const admin = require("./routers/admin/admin");
const seller = require("./routers/seller/seller");
const buyer = require("./routers/buyer/buyer");
const logistic = require("./routers/logistic/logistic");
const test = require("controllers/test");
const multer = require("services/multer");


const Upload = require("controllers/upload");
const Logo = require("controllers/logo");



const userRouters = require("./routers/user")
const signin = require("./routers/signin")
const registration = require("./routers/registration")
const category = require("./controllers/category")
const productsHome = require("./routers/productsHome");
const trims = require("./services/trims");
const OnlineShiping = require("controllers/onlineShiping");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => { trims(req.body), next() })

//confiure header http

//router basic
app.use(`/api/${API_VERSION}`, authRoutes)

app.use(`/api/${API_VERSION}/root`, root)
app.use(`/api/${API_VERSION}/admin`, admin)
app.use(`/api/${API_VERSION}/seller`, seller)
app.use(`/api/${API_VERSION}/buyer`, buyer)
app.use(`/api/${API_VERSION}/logistic`, logistic)

///////////////////////////////

app.use(`/api/${API_VERSION}/products`, productsHome)

app.post(`/api/${API_VERSION}/upload`, multer.single, test.Upload2)
app.use(`/api/${API_VERSION}/img/:type/:id/:name`, Upload.Upload)
app.use(`/api/${API_VERSION}/logo`, Logo.logo)




app.use(`/api/${API_VERSION}/users/`, userRouters)
app.use(`/api/${API_VERSION}/signin/`, signin)
app.use(`/api/${API_VERSION}/registration/`, registration)
app.use(`/api/${API_VERSION}/shipping/:id/`, OnlineShiping.GetHome)







app.use(`/api/${API_VERSION}/category/`, category.Get)
module.exports = app;