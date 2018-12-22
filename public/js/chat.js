var socket = io(); 

//creating a function for scrolling 
function scrollToBottom (){
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }

}
socket.on('connect' , function (){
  var params = jQuery.deparam(window.location.search);
//emitting join event for joining room 
  socket.emit('join', params, function (err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
       console.log('no err');
    }
  })
});

socket.on('disconnect' , function (){
  console.log('disconnected from server');
});

socket.on('updateUserList', function (users){
  //creating orderedlist using jquery
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  //rendering list on dom 
  jQuery('#users').html(ol);
})

//here we are listening msg from server and rendering on browser
socket.on('newMessage', function (message){
     var formattedTime = moment(message.createdAt).format('h:mm a');
     var template = jQuery('#message-template').html();
     var html = Mustache.render(template, {
       text : message.text,
       from : message.from,
       createdAt : formattedTime
     });

     jQuery('#messages').append(html);
     scrollToBottom();

    // //console.log('newMessage', message);
    // //here we are using jquery to create an  element
    // var li = jQuery('<li> </li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});


//listener for newLocationMessage 
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from : message.from,
    url : message.url,
    createdAt : formattedTime 
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target= "_blank">My current Location</a>');

  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});


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