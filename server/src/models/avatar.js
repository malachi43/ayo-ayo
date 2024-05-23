const { Schema, model } = require("mongoose");

const avatarSchema = new Schema({
    avatarList: {
        type: [{ avatar_url: String}],
        required: true,
        default: []
    }
})

module.exports = model("avatarList", avatarSchema);