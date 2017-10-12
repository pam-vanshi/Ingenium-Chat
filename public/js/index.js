var socket = io()

socket.on('connect', function () {
  console.log("connected to server");

    })

socket.on('disconnect', function () {
  console.log("disconnected to server");
})

socket.on('newMessage', function (message) {
  console.log("new message", message);
  var li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  jQuery('#message').append(li)
})

// socket.emit('createMessage', {
//   from: "harry",
//   text: "hello bitches"
// })

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'Moti Jhatel',
    text: jQuery('[name=message]').val()
  })
})
