const jwt = require("../services/jwt")
const moment = require("moment")
const User = require("../models/user")

function WillExpiredToken(token) {
    const { exp } = jwt.DecodedToken(token);

    const currentDate = moment.unix()

    if (currentDate < exp) {
        return (true)
    }
    else {
        return (false)
    }
}

function RefreshAccessToken(req, res) {


    const { refreshToken } = req.body;


    const isTokenExpired = WillExpiredToken(refreshToken);
    if (isTokenExpired) {
        res.status(404).send({ message: "session cerrada" })
    }
    else {
        const { id } = jwt.DecodedToken(refreshToken);
        User.findOne({ _id: id }, (err, userStored) => {
            if (err) {
                res.status(500).send({ message: err })
            }
            else {
                if (!userStored) {
                    res.status(404).send({ message: "usuario no encontrado" })

                }
                else {

                    res.status(200).send(
                        {
                            accessToken: jwt.CreateAcessToken(userStored),
                            refreshToken: refreshToken
                        }
                    )

                }
            }
        })
    }


}
module.exports =
{
    RefreshAccessToken
}