const { Schema, model } = require("mongoose");

const avatarSchema = new Schema({
    avatarList: {
        type: [{ avatar_url: String }],
        required: true,
        default: []
    }
})

avatarSchema.path("avatarList._id").get(v => v.toString())

module.exports = model("avatarList", avatarSchema);