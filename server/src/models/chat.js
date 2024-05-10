const { Schema, model } = require('mongoose');

const opts = { timestamps: true }
const chatSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: [true, "a chat must reference a user."]
    },
    text: {
        type: String,
        required: [true, "message field cannot be empty"]
    }
}, opts)

module.exports = model("chat", chatSchema);