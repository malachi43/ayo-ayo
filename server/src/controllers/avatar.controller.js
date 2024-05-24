const avatarService = require("../services/avatar.service");
const userService = require("../services/user.service");
class AvatarController {
    async getAvatars(req, res) {
        const avatarList = await avatarService.getAvatarList()
        res.status(200).json({ data: avatarList });
    }

    async getAvatar(req, res) {
        const { id } = req.params;
        const avatar_url = await avatarService.getAvatar(id);
        res.status(200).json({ data: avatar_url })
    }
}

module.exports = new AvatarController();