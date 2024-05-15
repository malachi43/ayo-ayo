const mock_data = require("./seed.json");
const mongoose = require("mongoose");
const AvatarList = require("./models/avatar");
const avatars = [
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715763707/osuucm7qjw3xvb40cyvt.jpg",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715763727/fzckpmrafhcogg7qcya8.jpg",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715763747/d2tx41byzd8gl61jq4tl.jpg"
]


const seedLeaderboardCollection = async () => {
    return await Promise.all(mock_data.map(async item => {
        const { avatarList } = await AvatarList.findOne()

        return { ...item, id: new mongoose.Types.ObjectId(), stars: generateRandomNumber(4), rank: Number(item.rank), avatar: avatarList[generateRandomNumber(3, true)] }
    }))
}

function generateRandomNumber(range, includeZero = false) {
    return includeZero ? Math.floor(Math.random() * (range)) : Math.floor(Math.random() * (range)) + 1;
}

async function seedAvatarCollection() {
    await AvatarList.deleteMany();
    let avatarCollection = await AvatarList.findOne()
    if (!avatarCollection) {
        avatarCollection = new AvatarList();
    }
    avatarCollection.avatarList = avatars;
    await avatarCollection.save();
}

module.exports = {
    seedLeaderboard: seedLeaderboardCollection,
    seedAvatars: seedAvatarCollection
};