const http = require('http');
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({
    path: './config.env'
})

const express = require('express');
const app = express();
const socketUtils = require('./utils/socketUtils')

const server = http.createServer(app);
const io = socketUtils.sio(server);
socketUtils.connection(io);

const socketIOMiddleware = (req, res, next) => {
    req.io = io;

    next();
};

app.use(cors());

app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
    req.io.emit("message", `Hello, ${req.originalUrl}`);
    res.send("hello world!");
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App running on port ${port}...`);
})