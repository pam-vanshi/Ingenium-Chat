const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000
const {generateMessage} = require('./utils/message.js')
var app =  express();
var server = http.createServer(app);
var io = socketIO(server)

app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', generateMessage('admin','Welcome to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('admin','New user joined!'))


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
