const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(bodyParser());
app.use('/', routes);

http.listen(port, function(){
  console.log('listening on *:3000');
});