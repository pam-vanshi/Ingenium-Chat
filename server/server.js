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

  socket.emit('newEmail', {
    from: "mohit12@gmail.com",
    text: "hola moti",
    createdAt: 123
  })
  socket.emit('newMessage', {
    from: "mohit pitbul patel",
    text: "hola I am moti"

  })
  socket.on('createMessage', (newemail) => {
    console.log("naya message aya hai be",newemail);
  })

  socket.on('createEmail', (newemail) => {
    console.log("new email created",newemail);
  })
  socket.on('disconnect', () => {
    console.log("disconnected to client");
  })
})

server.listen(port, console.log("server is running on " + port))
