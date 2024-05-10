const User = require("../models/user");
const UnathenticatedError = require("../utils/unauthenticatedError")
const { createToken } = require("../utils/jwt")

class Auth {
    #User;
    constructor() {
        this.#User = User;
    }
    async register({ username, email, password }) {
        const user = new User({ username, email, password });
        await user.save();
        return user;
    }
    async login({ email, password }) {
        const user = await this.#User.findOne({ email });
        if (!user) throw new UnathenticatedError("invalid email or password.");
        const isPasswordValid = user.isPasswordCorrect(password);
        if (!isPasswordValid) throw new UnathenticatedError("invalid email or password.");
        const token = createToken(user);
        user.password = "";
        return { token, user };
    }
}

module.exports = new Auth();