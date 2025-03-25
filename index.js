const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
app.use(express.static('public'));

io.on('connection', (socket) => {
//   console.log(`user ${socket.id} connected`);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('gameOver', (score) => {
    // Emit the score to all connected clients
    io.emit('scoreUpdate', `Game over! User# ${socket.id}'s score: ${score}`);
});


  socket.on('disconnect', () => {
    // console.log(`user ${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
    console.log(`Server running at http://localhost:${server.address().port}/`)
});