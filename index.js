const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(`${__dirname}/public/views/Inicio.html`,(e)=>{
      console.log(e);
      res.send('Error');
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});