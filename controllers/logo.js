

function logo(req, res) {
    // console.log(req.params)
    const { name, id, type } = req.params;
    // console.log(__dirname)
    // res.sendFile(__dirname + `/public/${type}/${id}/${name}.webp`)
    // res.sendFile(`C://Users/apequ/OneDrive/Escritorio/aplicacion/server/public/${type}/${id}/${name}.webp`)
    res.sendFile(`C://Users/apequ/OneDrive/Escritorio/aplicacion/server/public/img/server/logo.png`)
}

module.exports = {
    logo
};