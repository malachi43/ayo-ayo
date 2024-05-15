const { v2: cloudinary } = require("cloudinary")

function cloudinaryInit() {
    return cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
}

module.exports = cloudinaryInit