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



jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messagebox = jQuery('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: messagebox.val()
  }, function () {
    messagebox.val('')

  });
})


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});
