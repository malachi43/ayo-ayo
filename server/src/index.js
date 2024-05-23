const dotenv = require("dotenv")
dotenv.config()
//handle async errors.
require("express-async-errors");
const express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);
//package for real-time communication.
const { Server } = require("socket.io");
const io = new Server(server);
const multer = require("multer");
const PORT = process.env.PORT || 3001;
const connectToDatabase = require("./database/connect");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const authController = require("./controllers/auth.controller")
const leaderBoard = require("./models/leaderboard")
const { seedLeaderboard } = require("./seed_database")
const Ayo = require("./controllers/ayoayo.controller");
const { join } = require("node:path");
//file upload
const storage = multer.memoryStorage()
const upload = multer({ storage })
const cors = require("cors");
const helmet = require("helmet");
const AvatarList = require("./models/avatar");

// const cloudinaryInit = require("./utils/cloudinaryInit");
// const { v2: cloudinary } = require("cloudinary");
// const AvatarList = require("./models/avatar")
// const avatar = new AvatarList();
// const convertToBase64 = require("./utils/toBase64");

const baseUrl = "/api/v1";

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

// app.post(`${baseUrl}/uploads`, upload.single("avatar"), async (req, res) => {
//     cloudinaryInit();
//     if (!req.file) throw new Error(`upload a file.`)
//     const { mimetype, buffer } = req.file;
//     const dataURI = convertToBase64(buffer, mimetype)
//     const { secure_url } = await cloudinary.uploader.upload(dataURI, {
//         resource_type: "auto",
//     });
//     const clone = avatar.avatarList.slice();
//     clone.push(secure_url);
//     avatar.avatarList = clone;
//     await avatar.save();
//     res.status(200).json({ success: true, data: avatar });
// })

app.get(`${baseUrl}/avatar-list`, async (req, res) => {
    const avatars = await AvatarList.findOne();
    res.status(200).json({ data: avatars.avatarList });
})
app.post(`${baseUrl}/login`, authController.login);
app.post(`${baseUrl}/register`, authController.register);
app.get(`${baseUrl}/leaderboard`, async (req, res) => {
    // const leaderboard = await leaderBoard.find()
    let leaderboard = leaderBoard.find().sort({ score: -1 });
    leaderboard = await leaderboard;
    //make the rank to displayed in ascending order
    leaderboard = leaderboard.map((data, index) => {
        data.rank = index + 1;
        return data;
    })
    res.status(200).json({ data: leaderboard, count: leaderboard.length })
})

app.use(notFound);
app.use(errorHandler);
//start the server.
const startApp = async () => {
    try {
        await connectToDatabase(process.env.MONGO_URI);
        console.log(`CONNECTED TO DATABASE.`)
        const leaderboard_mock_data = await seedLeaderboard()
        await leaderBoard.deleteMany();
        await leaderBoard.insertMany(leaderboard_mock_data)
        server.listen(PORT, async () => {
            console.log(`Server is listening on port ${PORT}. Press Ctrl+C to terminate.`)
        })
    } catch (error) {
        console.error(`Error: `, error.message);
    }
}


startApp()