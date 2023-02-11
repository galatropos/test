const Webp = require('webp-converter');



function webp(path, name) {
    const result = Webp.cwebp(`tmp/${name}`, `${path}${name}.webp`, "-q 80", logging = "-v");
    result.then((response) => {
        console.log(response);
    });

}

module.exports = webp;