const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io")
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function main() {
    //open databse files
    const db = await open({
        filename: "chat.db",
        driver: sqlite3.Database,
    })

    //create message table
    await db.exec(`
        CREATE TABLE IF NOT EXIST MESSAGE(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
        )
    `)
}

const app = express()
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

app.get("/", (rq, res) => {
    res.sendFile(join(__dirname, "views", "index.html"))
});

io.on("connection", (socket) => {
    // console.log("A user connected");
    // socket.on("disconnect", () => {
    //     console.log("User disconnected");
    // })
    socket.on("user message", async (msg) => {
        let result;
        try {
            //store the message in databse
            result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        } catch (e) {
            //To handle the error
            return;
        }
        io.emit("message", msg, result/lastID);
    })
});

server.listen(3000, () => console.log("Server started at PORT:3000"));