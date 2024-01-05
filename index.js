const express = require("express");
const http = require("http");
const { Server } = require("socket.io")

const { PORT } = require("./config/server-config.js");
const connect = require('./config/db-config.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })

    socket.on('join_room', (data) => {
        console.log("joining a room", data.roomid);
        socket.join(data.roomid);
    });

    socket.on("new_msg", (data) => {
        console.log("Received new message", data);
        // will emit message to particular roomid
        io.to(data.roomid).emit("msg_rcvd", data);
        // socket.emit("msg_rcvd", data);   // to self only
        // socket.broadcast.emit("msg_rcvd", data);  // to everyone except self
    });
    });


app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));

app.get("/chat/:roomid/:user", async (req, res) => {
    res.render("index", {
        roomid: req.params.roomid,
        user: req.params.user,
    });
});

server.listen(PORT, async () => {
    console.log(`Server is up and running on PORT ${PORT}`);
    await connect();
    console.log("db connected");
});