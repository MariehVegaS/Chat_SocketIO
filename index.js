const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const router = express.Router();
const port = process.env.PORT || 3000;

var users = [];
var rooms = [];
var username;
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/views/Inicio.html`, (e) => {
  });
});

app.get('/registro', function (req, res) {
  res.sendFile(`${__dirname}/public/views/Registro.html`, (e) => {
  });
});

app.get('/chatroom/:username', function (req, res) {
  username = req.params.username;
  res.sendFile(`${__dirname}/public/views/chatroom.html`, (e) => {
    //res.send(JSON.stringify(e));
  });
});

http.listen(port, function () {
  console.log('listening on *:3000');
});

io.on('connection', function (socket) {
  console.log(`User connected ${socket.id}  ${username}`);
  users.push({ username: username, id: socket.id });
  socket.name = username;

  let room = 'lobby';
  socket.join(room);

  io.sockets.in(room).emit('msg', `Se ha unido al room ${room}`, socket.name);
  io.emit('render', users);
  io.emit('renderRooms', rooms);


  socket.on('msg', function (msg) {
    io.sockets.in(room).emit('msg', msg, socket.name);
  })

  socket.on('changeRoom', function (newRoom) {
    socket.leave(room);
    socket.join(newRoom);
    room = newRoom;
    socket.emit('changeRoom', newRoom);
  })

  socket.on('createRoom', (room) => {
    rooms.push(room);
    io.emit('renderRooms', rooms);
  })
  socket.on('createPrivateRoom', (newRoom, socketId) => {
    rooms.push(newRoom);
    socket.join(newRoom);
    io.to(socketId).emit('joinPrivate', newRoom);
    io.to(socketId).emit('renderPrivateRoom', newRoom);
    io.emit('renderPrivateRooms')
  })

  socket.on('renderPrivateRooms', () => {
    io.emit('renderRooms', rooms);
    console.log('Rendering rooms')
  })

  socket.on('joinPrivate', (nameRoom) => {
    socket.leave(room);
    socket.join(nameRoom);

  })
  socket.on('addPrivateChat', (socketNew) => {
    let newRoom = `${socket.name}-${socketNew.username}`;
    // rooms.push(newRoom);
    socket.leave(room);
    socket.join(newRoom);
    socket.emit('addRoom', newRoom);

    io.to(socketNew.id).emit('joinPrivate', newRoom);
    io.to(socketNew.id).emit('addRoom', newRoom);

    io.emit('renderRooms', rooms);
    // io.to(socketNew.id).emit('renderPrivateRoom', newRoom);

    // io.to(socketNew.id).emit('recieveChat', socket);
  })


  socket.on('disconnect', function () {
    console.log(`User disconnected ${socket.id}`);
    let index = users.indexOf({ username: username, id: socket.id });
    users.splice(index, 1);
    io.emit('msg', 'Ha abandonado el lobby', socket.name);
    console.log(users);

  });

});

