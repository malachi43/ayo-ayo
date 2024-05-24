const User = require("../models/user");
const avatarService = require("../services/avatar.service");

class UserService {
    #User;
    constructor() {
        this.#User = User;
    }

    async getUser(id) {
        const user = await this.#User.findById(id)
        return {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            _id: user._id
        };
    }

    async updateUserAvatar({ userId, avatarId }) {
        const { _id } = await this.getUser(userId);
        const { avatar_url } = await avatarService.getAvatar(avatarId);

        if (!_id && !avatar_url) throw new Error(`user with id: ${userId} does not exist.`)
        await this.#User.updateOne({ _id }, { avatar: avatar_url }, { new: true, runValidator: true })

        //retrieve the updated user.
        const updatedUserAvatar = await this.getUser(userId);

        return {
            avatar: updatedUserAvatar.avatar,
            email: updatedUserAvatar.email,
            username: updatedUserAvatar.username,
            createdAt: updatedUserAvatar.createdAt,
            updatedAt: updatedUserAvatar.updatedAt,
            _id: updatedUserAvatar._id
        };
    }

}

module.exports = new UserService();