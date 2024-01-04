console.log("welcome to sockets");
var socket = io();


let input = document.getElementById("chat_box");
    let msgList = document.getElementById("msg_list");
    let send = document.getElementById("send");

    send.addEventListener("click", () => {
        let msg = input.value;
        socket.emit("new_msg", {
            message: msg
        });
        input.value = "";
    });


    socket.on("msg_rcvd", (data) => {
        let msgLi = document.createElement("li");
        msgLi.textContent = data.message;
        msgList.appendChild(msgLi);
    });