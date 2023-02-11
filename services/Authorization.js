const jwt = require("./jwt");


exports.user = function (header) {
    const { authorization } = header.headers;

    const refresh = jwt.DecodedToken(authorization);
    const { id } = refresh;
    return (id)
}

exports.business = function (header) {
    const { authorization } = header.headers;

    const refresh = jwt.DecodedToken(authorization);
    const { business } = refresh;




    return (business)
}
exports.establishment = function (header) {
    const { authorization } = header.headers;

    const refresh = jwt.DecodedToken(authorization);
    const { establishment } = refresh;
    return (establishment)
}


