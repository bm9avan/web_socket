const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const userIo= io.of("/user")
userIo.on("connection", (socket)=>{
  console.log("connected to namesapace"+socket.username)
})
userIo.use((socket, next)=>{
  if(socket.handshake.token){
    socket.username="name"//fettchUserFromToken(socket.handshake.token)
    next()
  }else{
    next(new Error("invalid token"))
  }
})

io.on("connection", (socket) => {
  console.log("new socket added", socket.id);
  socket.on("message", (msgObj, room) => {
    if(room==""){
      socket.broadcast.emit("message", msgObj);
    }else{
      socket.to(room).emit("message", msgObj);
    }
  });
  socket.on("typing", (user) => {
    socket.broadcast.emit("typing", user);
  });
  socket.on("newuserRoom", (obj) => {
    socket.join(obj.room)
    socket.broadcast.emit("newuserRoom", obj);
  });
});

app.use(express.static(path.join(__dirname + "/frontend")));

app.get("/", (req, res) => {
  res.json({ new: "server connected" });
});

server.listen(80, () => {
  console.log("server connected");
});
