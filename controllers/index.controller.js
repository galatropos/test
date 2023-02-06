const { getBuckets } = require('../helpers/s3');

const index = async (req, res) => {
    console.log("gola")

    const data = await getBuckets();

    res.render('index', {
        buckets: data.Buckets
    });
};

module.exports = {
    index
}