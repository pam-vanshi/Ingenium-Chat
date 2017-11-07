const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000
const {generateMessage} = require('./utils/message.js')
const {isRealString} = require('./utils/validation.js')
var app =  express();
var server = http.createServer(app);
var io = socketIO(server)
var {Users} = require('./utils/users.js')
var users = new Users()
app.use(express.static(publicPath))//html and java script file ;



io.on('connection', (socket) => {
  console.log("New user connected");



  socket.on('join',(params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
    return callback("name and roomname are required")
    }

    socket.join(params.room)
    users.removeUser(socket.id)//remove user from any potential previous rooms
    users.addUser(socket.id,params.name,params.room,)
    //io.to() is used when we emit an event to a particular room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage', generateMessage('admin',`Welcome to ${params.room}`));//sent to the user
    socket.broadcast.emit('newMessage', generateMessage('admin',`${params.name} joined`))//sent to everyone except user

    callback()

  })

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    var user = users.getUser(socket.id)
    io.emit('newMessage', generateMessage(user.name, message.text));//send message to everyone
    callback();
  });


  socket.on('createLocationMessage', (coords) => {
    io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
  });

  socket.on('createNotification', (notification) => {
    socket.broadcast.emit('newNotification', {from: "User", text: notification.text});
  });

    socket.on('disconnect', () => {
    console.log("disconnected to client");
    var user = users.removeUser(socket.id)

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
    }
  })
})

server.listen(port, console.log("server is running on " + port))
