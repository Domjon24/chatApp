const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
let users = [];

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
app.use(express.static('public'));

io.on('connection', (socket) => {

  io.emit('welcome message', `${socket.id} has arrived!`)
  
  socket.on("join server", (username) => { //welcome message
    const user = {
      username,
      id: socket.id
    }
      users.push(user);
      io.emit("new user", users);
  })


  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('gameOver', (score) => {

    io.emit('scoreUpdate', `Game over! User# ${socket.id}'s score: ${score}`);
});


  socket.on('disconnect', (socket) => {
    io.emit('disconnection', `${socket.id} has left`)
  });
});

server.listen(3000, () => {
    console.log(`Server running at http://localhost:${server.address().port}/`)
});