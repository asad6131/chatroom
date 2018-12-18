var socket = io(); 

socket.on('connect' , function (){
  console.log('connected to server');

  //here we are creating/emitting  a message to server for sending to another user 
  // socket.emit('createMessage', {
  //   from : 'zaqqi',
  //   text: 'hey its me.'
  // });
});

socket.on('disconnect' , function (){
  console.log('disconnected from server');
});

//here we are listening msg from server and rendering on browser
socket.on('newMessage', function (message){
    console.log('newMessage', message);
    //here we are using jquery to create an  element
    var li = jQuery('<li> </li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


//listener for newLocationMessage 
socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target= "_blank">My current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

//now we don't need custom message because we are now sending it from browser ;)...
// socket.emit('createMessage', {
//   from: 'frank',
//   text: 'yess!'
// }, function(data) {
//   console.log('got it', data);
// });

//handler for submit button of form 
jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  var messageTextbox =  jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    //here we are using jquery to select text field of form
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});

//handler for location button
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if(!navigator.geolocation){
    return alert('Geolocatinon not supported by your browser.');
  }
//we are gonna disable this button after we are gonna confirm the user evan have support for location
  locationButton.attr('disabled' , 'disabled').text('sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});