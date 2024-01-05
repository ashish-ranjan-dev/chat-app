const express = require("express");
const http = require("http");
const { Server } = require("socket.io")

const { PORT } = require("./config/server-config.js");
const connect = require('./config/db-config.js');

const Group = require('./models/group');
const Chat = require('./models/chat');

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

    socket.on("new_msg", async (data) => {
        console.log("Received new message", data);
        const chat = await Chat.create({
            roomid: data.roomid,
            sender: data.sender,
            content: data.message
        });
        // will emit message to particular roomid
        io.to(data.roomid).emit("msg_rcvd", data);
        // socket.emit("msg_rcvd", data);   // to self only
        // socket.broadcast.emit("msg_rcvd", data);  // to everyone except self
    });
    });


app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/chat/:roomid/:user", async (req, res) => {
    const group = await Group.findById(req.params.roomid);
    const chats = await Chat.find({
        roomid: req.params.roomid
    });
    // console.log(chats)
    res.render("index", {
        roomid: req.params.roomid,
        user: req.params.user,
        groupname: group.name,
        previousmsgs: chats
    });
});

app.get('/group', async (req, res) => {
    res.render('group');
});

app.post('/group/join',async (req,res)=>{
    res.redirect("/chat/"+req.body.groupid+"/"+req.body.username)
})

app.post('/group', async (req, res) => {
    console.log(req.body);
    await Group.create({
        name: req.body.groupname
    });
    const group = await Group.findOne({ name: req.body.groupname });
    const groupId = group._id.toString();
    res.redirect("/chat/" + groupId + "/" + req.body.username);

});

server.listen(PORT, async () => {
    console.log(`Server is up and running on PORT ${PORT}`);
    await connect();
    console.log("db connected");
});