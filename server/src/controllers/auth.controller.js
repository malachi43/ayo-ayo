const authService = require("../services/auth.service");
const BadRequestError = require("../utils/badRequestError");

class AuthController {
    async register(req, res) {
        let { username, email, password } = req.body;
        if (username && email && password) {
            password = String(password);
            const user = await authService.register({ username, email, password });
            res.status(201).json({ data: user });
        } else {
            throw new BadRequestError("username, email and passsword fields are required.")
        }
    }

    async login(req, res) {
        let { email, password } = req.body;
        if (email && password) {
            password = String(password);
            const user = await authService.login({ email, password });
            res.status(200).json({ data: user });
        } else {
            throw new BadRequestError("email and passsword fields are required.")
        }
    }

    async forgotPassword(req, res) {
        const { email } = req.body

    }
}

module.exports = new AuthController();