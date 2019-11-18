const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const router = express.Router();
const port = process.env.PORT || 3000;


app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(`${__dirname}/public/views/Inicio.html`,(e)=>{
  });
});

app.get('/registro', function(req, res){
    res.sendFile(`${__dirname}/public/views/Registro.html`,(e)=>{
    });
});

app.get('/chatroom', function(req, res){
    res.sendFile(`${__dirname}/public/views/Chatroom.html`,(e)=>{
    });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});