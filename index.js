const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io")

const app = express()
const server = createServer(app);
const io = new Server(server);

app.get("/", (rq, res) => {
    res.sendFile(join(__dirname, "views", "index.html"))
});

io.on("connection", (socket) => {
    // console.log("A user connected");
    // socket.on("disconnect", () => {
    //     console.log("User disconnected");
    // })
    socket.on("user message", (msg) => {
        io.emit("message", msg);
    })
});

server.listen(3000, () => console.log("Server started at PORT:3000"));