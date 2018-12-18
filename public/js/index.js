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

socket.on('newMessage', function (message){
    console.log('newMessage', message);
    //here we are using jquery to create an  element
    var li = jQuery('<li> </li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


//now we don't need custom message because we are now sending it from browser ;)...
// socket.emit('createMessage', {
//   from: 'frank',
//   text: 'yess!'
// }, function(data) {
//   console.log('got it', data);
// });

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    //here we are using jquery to select text field of form
    text: jQuery('[name=message]').val()
  }, function() {
    
  });
});