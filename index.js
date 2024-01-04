const express = require("express");
const http = require("http");
const { Server } = require("socket.io")

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const PORT = 3000;

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })

    socket.on("new_msg", (data) => {
        console.log("Received new message", data);
        // will emit message to particular roomid
        io.emit("msg_rcvd", data);
    });
    });

app.use("/", express.static(__dirname + "/public"));

server.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`);
});