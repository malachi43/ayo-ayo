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
const { seedLeaderboard, seedAvatars } = require("./seed_database")
const Ayo = require("./controllers/ayoayo.controller");
const { join } = require("node:path");
//file upload
const storage = multer.memoryStorage()
const upload = multer({ storage })
const cloudinaryInit = require("./utils/cloudinaryInit")
const { v2: cloudinary } = require("cloudinary");
const AvatarList = require("./models/avatar");
const convertToBase64 = require("./utils/toBase64");
const avatar = new AvatarList();


const baseUrl = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

app.post(`${baseUrl}/uploads`, upload.single("avatar"), async (req, res) => {
    // cloudinaryInit();
    // const { mimetype, buffer } = req.file;
    // const dataURI = convertToBase64(buffer, mimetype)
    // const { secure_url } = await cloudinary.uploader.upload(dataURI, {
    //     resource_type: "auto",
    // });
    // const clone = avatar.avatarList.slice();
    // clone.push(secure_url);
    // avatar.avatarList = clone;
    // await avatar.save();
    res.status(200).json({ success: true, data: req.file });
})
app.post(`${baseUrl}/login`, authController.login);
app.post(`${baseUrl}/register`, authController.register);
app.get(`${baseUrl}/leaderboard`, async (req, res) => {
    // const leaderboard = await leaderBoard.find()
    let leaderboard = leaderBoard.find().sort({ rank: -1 });
    leaderboard = await leaderboard;
    console.log(leaderboard);
    res.status(200).json({ data: leaderboard, count: leaderboard.length })
})
app.get(`${baseUrl}/ayoayo`, (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.sendFile(join(__dirname, "public", "javascripts", "ayoayo.js"));
})

app.use(notFound);
app.use(errorHandler);
//start the server.
const startApp = async () => {
    try {
        await connectToDatabase(process.env.MONGO_URI);
        console.log(`CONNECTED TO DATABASE.`)
        await seedAvatars();
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