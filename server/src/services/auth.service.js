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
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) throw new UnathenticatedError("invalid email or password.");
        const token = createToken(user);
        user.password = "";
        return { token, user };
    }

    async forgotPassword(email) {
        const isUser = await this.#User.findOne({ email });
        if (!isUser) return { status: true, msg: `a password reset email has been sent to you.` }
        
    }
}

module.exports = new Auth();