const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
  console.log('new user connected');

  //listening the join event from client for listening event and assigning the required room
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required.');
    }
    //joining the specific room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);


    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //socket.emit from admin to new user
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
   
      // socket.broadcast.emit from admin to all users other than new 
      socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined`));    
    callback();
  }); 


  //here we are listening a new message coming from one user
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
   
    //and then we are emitting the users message to all other users
     io.emit('newMessage', generateMessage(message.from, message.text)); 
     callback();

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
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});