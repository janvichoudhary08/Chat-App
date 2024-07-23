// Node Server which will handle socket io connection

const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an Express application
const app = express();

// Enable CORS
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server and enable CORS
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // Change this to the origin of your client
    methods: ["GET", "POST"]
  }
});



const users = {};

io.on('connection',socket =>{
  // If any  new user joins,let other users connect to the server !
   socket.on('new-user-joined', name =>{
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
   });

   //If someone sends a message, boradcast it to other people
   socket.on('send', message =>{
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
   });

   // If someone leaves the chat, let others know
   socket.on('disconnect', message => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    });
})

// Listen on a specific port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

