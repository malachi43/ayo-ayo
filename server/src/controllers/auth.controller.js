const authService = require("../services/auth.service");
const BadRequestError = require("../utils/badRequestError");

class AuthController {
    async register(req, res) {
        const { username, email, password } = req.body;
        console.log(username, email, password)
        if (username && email && password) {
            const user = await authService.register({ username, email, password });
            res.status(201).json({ data: user });
        } else {
            throw new BadRequestError("username, email and passsword fields are required.")
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        console.log(`login details: `, email, password);
        if (email && password) {
            const user = await authService.login({ email, password });
            res.status(200).json({ data: user });
        } else {
            throw new BadRequestError("email and passsword fields are required.")
        }
    }
}

module.exports = new AuthController();