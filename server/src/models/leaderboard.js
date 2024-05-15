const { Schema, model } = require("mongoose");

const opts = { timestamps: true }

const leaderboardSchema = new Schema({
    // gameId: {
    //     type: String,
    //     // unique: true,
    //     required: [true, "leaderboard must reference a game."]
    // },
    // userId: {
    //     type: String,
    //     required: [true, "leaderboard must reference a user."]
    // },
    score: {
        type: Number,
        required: [true, "score field is required."]
    },
    name: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    }

}, opts)

leaderboardSchema.path("_id").get((v) => v.toString());
leaderboardSchema.index({ score: -1 });

module.exports = model("leaderboard", leaderboardSchema);;