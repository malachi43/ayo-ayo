const userService = require("../services/user.service");

class UserController {
    async getUser(req, res) {
        const { id } = req.params;
        const user = await userService.getUser(id);
        res.status(200).json({ data: user });
    }
    async updateUserAvatar(req, res) {
        const { userId, avatarId } = req.params
        const updatedUserAvatar = await userService.updateUserAvatar({ userId, avatarId })
        res.status(200).json({ data: updatedUserAvatar });
    }
}

module.exports = new UserController();