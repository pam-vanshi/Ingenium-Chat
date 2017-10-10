var socket = io()

socket.on('connect', function () {
  console.log("connected to server");

  socket.emit('createEmail',{
    to: "mohitpitbulpatel@lodu.com",
    text: "aur pitbul"
  } )

  socket.emit('createMessage',{
    to: "mohit pitbul patel",
    text: "aur pitbul lodu"
  })




});

socket.on('disconnect', function () {
  console.log("disconnected to server");
})

socket.on('newEmail', function (email) {
  console.log("new email", email);
})
socket.on('newMessage', function (message) {
  console.log("new message", message);
})
