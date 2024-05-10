const { Schema, model } = require("mongoose");

const opts = { timestamps: true }

const usergameSchema = new Schema({
    userId: {
        type: String,
        required: [true, "userId field is required."],
        unique: true
    },
    gameId: {
        type: String,
        required: [true, "gameId field is required."],
        unique: true
    },
    score: {
        type: Number,
        required: [true, "score field is required."],
    }
}, opts);

module.exports = model("usergame", usergameSchema);