import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("user connected, id : ", socket.id);

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("user joined room ", room);
    });

    socket.on("message", ({roomCode, message}) => {
        console.log({roomCode, message});
        console.log("socket rooms: ",socket.rooms);
        if(roomCode == '') {
            socket.emit("receive-message", message);
        } else {
            socket.to(roomCode).emit("receive-message",message);
        }
        console.log("message", {roomCode, message});
    });

    socket.on("disconnect", (m) => {
        console.log("user disconnected: ", m);
    });
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
