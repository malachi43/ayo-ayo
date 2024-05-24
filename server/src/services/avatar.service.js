const Avatar = require("../models/avatar")

class AvatarService {
    #Avatar;
    constructor() {
        this.#Avatar = Avatar;
    }

    async getAvatarList() {
        const { avatarList } = await this.#Avatar.findOne();
        return avatarList;
    }

    async getAvatar(id) {
        const { avatarList } = await this.#Avatar.findOne();
        const avatar_details = avatarList.find(data => data._id == id);
        return avatar_details
    }
}

module.exports = new AvatarService();
