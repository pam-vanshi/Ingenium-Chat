var socket = io() //io is available because we loaded the libraty in html file

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#message');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  console.log("connected to server");
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
    window.location.href = '/'}
    else {
      console.log("No error");
    }
  })

    })

socket.on('disconnect', function () {
  console.log("disconnected to server");
})

socket.on('updateUserList', function (users) {
  console.log("user list", users);
  var ol = jQuery('<ol></ol>')

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user))
  })
  jQuery('#users').html(ol)
})
socket.on('newMessage', function (message) {
   var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = jQuery('#messsage-template').html()
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt:formattedTime
  })
  jQuery('#message').append(html)

  // console.log("new message", message);
  // var li = jQuery('<li></li>')
  // li.text(`${message.from} ${formattedTime}: ${message.text}`)
  //
  scrollToBottom();
})
socket.on('newNotification', function (notification) {
  console.log("Notification has been sent");
  notifyMe(notification.from,notification.text)

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


jQuery('#notification-form').on('submit', function (e) {
  e.preventDefault();

  var notificationbox = jQuery('[name=notification]')
  socket.emit('createNotification', {
    from: 'User',
    text: notificationbox.val()
  }, function () {
    notificationbox.val('')

  });
})
// jQuery('#notifications').on('click', function (e) {
//   e.preventDefault();
//
//   var messagebox = jQuery('[name=message]')
//   socket.emit('createNotification', {
//     from: 'Pramudit',
//     text: 'Commented on your post'
//   }, function () {
//     messagebox.val('')
//
//   });
// })

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

function notifyMe(user,text) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var options = {
              body: `${user}: ${text}`,
              icon: "https://wiki.smu.edu.sg/is480/img_auth.php/thumb/4/4e/Ingenium-logo.png/450px-Ingenium-logo.png",
              dir : "ltr"
          };
    var notification = new Notification("Hi there",options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var options = {
                  body: `${user}: ${text}`,
                  icon: "https://wiki.smu.edu.sg/is480/img_auth.php/thumb/4/4e/Ingenium-logo.png/450px-Ingenium-logo.png",
                  dir : "ltr"
              };
        var notification = new Notification("Hi there",options);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}
//onclick="notifyMe()"
