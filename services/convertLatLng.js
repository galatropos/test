

exports.convertLatLng = function (logistic, client) {
    const lat1 = logistic.lat;
    const lat2 = client.lat;
    const lon1 = logistic.lng;
    const lon2 = client.lng;


    var r = 6378.137;
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = r * c;
    return d * 1000; // meters


    // return ("hola")
}

