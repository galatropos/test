
const jwt = require("../services/jwt")
const moment = require("moment")
const User = require("models/user")
const { CatchError } = require("services/catchError");



async function admin(req, res, next) {
    const refreshToken = req.get('Authorization')


    try {

        function WillExpiredToken(token) {
            try {
                jwt.DecodedToken(token)
                return (false)
            } catch (err) {
                return (true)
            }


        }


        const isTokenExpired = WillExpiredToken(refreshToken);

        if (!isTokenExpired) {


            const { id, business } = jwt.DecodedToken(refreshToken);
            req.user = await User.findOne({ _id: id, business: business, master: true });
            if (req.user) {
                res.set('refreshToken', jwt.CreateRefreshToken(req.user));
                res.set('accessToken', jwt.CreateAcessToken(req.user));
                next()

            }
            else throw { code: 401 }


        }
        else throw { code: 401 }



    } catch (error) {
        CatchError(res, error)

    }




}

module.exports = admin;







