const mock_data = require("./seed.json");
const mongoose = require("mongoose");
const AvatarList = require("./models/avatar");
const avatars = [
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814010/re60rhe81xuhofzdn1cf.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814125/vhy2a1uiwvmwvyxnio5g.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814142/va8aqjvcbau5e5bo8q07.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814165/a3xfpqezx9cxvytzc1mo.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814178/rhsrh9leox7qhpdk4jdm.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814193/pyhtalbf6oerlrvecw6o.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814211/fp7bew01opjv5f4bpwqo.png",
    "https://res.cloudinary.com/devgxsnc3/image/upload/v1715814229/l51srypvwtk5j1udq0lq.png"]


const seedLeaderboardCollection = async () => {
    return await Promise.all(mock_data.map(async (item, index) => {
        const { avatarList } = await AvatarList.findOne()

        return { ...item, id: new mongoose.Types.ObjectId(), stars: generateRandomNumber(5), rank: Number(index + 1), avatar: avatarList[generateRandomNumber(avatars.length, true)] }
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