const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let players = [];

io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  if (players.length < 4) {
    players.push(socket.id);
    socket.emit('player-joined', players.length);
    io.emit('update-players', players.length);
  } else {
    socket.emit('room-full');
  }

  socket.on('roll-dice', (data) => {
    io.emit('dice-rolled', data);
  });

  socket.on('disconnect', () => {
    players = players.filter(id => id !== socket.id);
    io.emit('update-players', players.length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
