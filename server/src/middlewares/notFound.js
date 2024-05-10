

const notFound = (req, res) => {
    res.status(400).json({ status: false, msg: "PAGE NOT FOUND." });
}

module.exports = notFound;