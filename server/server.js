const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
  console.log('new user connected');

  //emit to single connection
  // socket.emit('newMessage', {
  //   from: 'mike',
  //   text : `hey, what's going on.`,
  //   createdAt: 1234567

      //socket.emit from admin to new user
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
   
      // socket.broadcast.emit from admin to all users other than new 
      socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));
  

  //here we are listening a new message coming from one user
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
   
    //and then we are emitting the users message to all other users
     io.emit('newMessage', generateMessage(message.from, message.text)); 
     callback('this is from the server');

    //but we need to emit the message to all of the other users but not ourself.... so as a solution we are using broadcasting
    // socket.broadcast.emit('newMessage', {
    //   from : message.from,
    //   text : message.text,
    //   createdAt : new Date().getTime()
    // }); 
  });


  //listener for send location message from customer 
  socket.on('createLocationMessage' , (coords) => {
    io.emit('newLocationMessage' , generateLocationMessage('Admin' , coords.latitude, coords.longitude));
  });
  
  
  socket.on('disconnect' , () =>{
    console.log('user was disconnected');
  });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});