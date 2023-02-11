const jwt = require("jwt-simple");
const moment = require("moment");
const SECRET_KEY = "$2a$10$BevEUckX7pUxqDs9YDL4uiigP44CQ7nneYLQDeuqt7xaQsZxjlby";

exports.CreateAcessToken = function (user) {

    let payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        business: user.business,
        rol: user.rol,
        establishment: user.establishment,
        CreateToken: moment().unix(),
        exp: moment().add(1000, "minutes").unix()

    }
    if (user.buyer)
        payload.buyer = true;

    return (jwt.encode(payload, SECRET_KEY))
}

exports.CreateRefreshToken = function (user) {
    const payload = {
        id: user._id,
        business: user.business,
        establishment: user.establishment,
        rol: user.rol,
        exp: moment().add(1000, "minutes").unix()

    }
    return (jwt.encode(payload, SECRET_KEY))
}

exports.DecodedToken = function (token) {

    return (jwt.decode(token, SECRET_KEY))

}