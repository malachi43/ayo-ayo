

const errorHandler = (err, req, res, next) => {
    const customObj = {
        errorMsg: err.message || "INTERNAL SERVER ERROR.",
        errorCode: err.statusCode || 500
    }

    if (err.code === 11000) {
        customObj.errorMsg = `email: ${err.errorResponse.keyValue.email} already exists.`
    }
    if (res.headersSent) return next(err);

    if (process.env.NODE_ENV == "production") {
        res.status(500).json({ status: false, msg: err.message });
    } else {
        res.status(customObj.errorCode).json({ status: false, msg: customObj.errorMsg });
    }
}

module.exports = errorHandler;