import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  //input field states
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomCode);
    setRoomCode("");
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { roomCode, message });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: ", socket.id);
      setSocketId(socket.id);
    });

    socket.on("receive-message", (newMessage) => {
      console.log("message received: ", newMessage);
      setMessages((messages) => [...messages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <Typography>Socket ID: {socketId}</Typography>
      <div style={{ display: "flex", flex: "1", gap: "1rem" }}>
        <TextField
          value={roomCode}
          onChange={(e) => setRoomCode(e.currentTarget.value)}
          label="Room code"
          variant="outlined"
        />
        <Button variant="contained" onClick={joinRoomHandler}>
          Join
        </Button>
      </div>

      <div
        style={{ display: "flex", flex: "1", gap: "1rem", marginTop: "2rem" }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          label="Type message..."
          variant="outlined"
        />
        <Button variant="contained" onClick={sendMessageHandler}>
          Send
        </Button>
      </div>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
