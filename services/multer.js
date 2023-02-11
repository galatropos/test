const multer = require('multer')
const webp = require('webp-converter');
const { v4 } = require('uuid');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, 'tmp')
    },
    filename: function (req, file, cb) {
        const name = v4()
        req.tmp = name;
        // cb(null, file.fieldname + '-' + Date.now())
        cb(null, name)
    }
})



const single = multer({ storage: storage })

exports.single = single.single('myFile')




