class UnathenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnathenticatedError";
        this.statusCode = 401;
    }
}

module.exports = UnathenticatedError;