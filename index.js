const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // console.log("new socket added", socket.id);
  socket.on("test", (msg) => {
    // console.log('message from test.html: ' + msg);
    // io.emit("retest", msg);
    socket.broadcast.emit("retest", msg);
  });
});

app.use(express.static(path.join(__dirname + "/frontend")));

app.get("/", (req, res) => {
  res.json({ new: "server connected" });
});

server.listen(80, () => {
  console.log("server connected");
});
