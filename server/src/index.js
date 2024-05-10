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
const seedDatabase = require("./seed_database")

//file upload
const storage = multer.memoryStorage()
const upload = multer({ storage })

const baseUrl = "/api/v1";


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post(`${baseUrl}/login`, authController.login);
app.post(`${baseUrl}/register`, authController.register);
app.get(`${baseUrl}/leaderboard`, async (req, res) => {
    const leaderboard = await leaderBoard.find();
    res.status(200).json({ data: leaderboard, count: leaderboard.length })
})

app.use(notFound);
app.use(errorHandler);
//start the server.
const startApp = async () => {
    try {
        await connectToDatabase(process.env.MONGO_URI);
        console.log(`CONNECTED TO DATABASE.`)
        const leaderboard_mock_data = seedDatabase()
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