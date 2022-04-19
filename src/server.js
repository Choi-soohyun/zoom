import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

// view
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

// static
app.use('/public', express.static(__dirname + '/public'));

// router
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen)

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // [{ server }] http & ws = If you want to run on the same port, WebSocket on the Http 

function onSocketClose() {
   console.log('Disconnected from the Browser')
}

const sockets = [];

wss.on("connection", (socket) => {
   sockets.push(socket)
   socket['nickname'] = 'Anon'
   console.log('Connected to Browser');
   socket.on('close', onSocketClose);
   socket.on('message', (msg) => {
      const message = JSON.parse(msg.toString('utf8'))

      if(message.type === 'new_message') {
         sockets.forEach(aSocket => {
            aSocket.send(`${socket.nickname}: ${message.payload}`)
         });
      } else if(message.type === 'nickname') {
         console.log(message.payload);
         socket['nickname'] = message.payload;
      }
   });
})

server.listen(3000, handleListen);