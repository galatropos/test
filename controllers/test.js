const multer = require('multer')
const webp = require('webp-converter');







exports.Upload2 = (req, res) => {
    // console.log(req)
    console.log("first")
    // const result = webp.cwebp(`tmp/user/${req.temp}`, `public/img/user/products/${req.temp}.webp`, "-q 80", logging = "-v");
    // result.then((response) => {
    //     // console.log(response);
    // });

    res.status(200).send(req.tmp);

}


// module.exports = {
//     Upload2,
//     exports
// };