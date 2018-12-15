const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
  console.log('new user connected');
  
  socket.emit('newMessage', {
    from: 'mike',
    text : `hey, what's going on.`,
    createdAt: 1234567
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message); 
  });
  socket.on('disconnect' , () =>{
    console.log('user was disconnected');
  });
});

 
server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});