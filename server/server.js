const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000

var app =  express();
var server = http.createServer(app);
var io = socketIO(server)

app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', {
    from: "admin",
    text: "Welcome to chat app"
  });
  socket.broadcast.emit('newMessage', {
    from: "admin",
    text: "New user joined"
  })


  socket.on('createMessage', (message) => {
    console.log("naya message aya hai be",message);
    io.emit('newMessage', {
      from:message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })

    socket.on('disconnect', () => {
    console.log("disconnected to client");
  })
})

server.listen(port, console.log("server is running on " + port))
