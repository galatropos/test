
const jwt = require("../services/jwt")
const moment = require("moment")
const User = require("models/user")
const { CatchError } = require("services/catchError");



async function seller(req, res, next) {
    try {
        const refreshToken = req.get('Authorization')
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


            const { id, business, establishment } = jwt.DecodedToken(refreshToken);
            req.user = await User.findOne({ _id: id, business: business, establishment: establishment, seller: true });
            req.type = "seller";
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

module.exports = seller;







