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
});