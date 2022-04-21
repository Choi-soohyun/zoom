import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import SocketIO from 'socket.io'

const app = express();

// view
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

// static
app.use('/public', express.static(__dirname + '/public'));

// router
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

// app.listen(3000, handleListen)

const httpServer = http.createServer(app);
const weServer = SocketIO(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

// 실행하고 나면 아래 접속 해보기
// http://localhost:3000/socket.io/socket.io.js

weServer.on('connection', socket => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  })
  socket.on('enter_noom', (noomName, done) => {
    console.log(socket.id);
    console.log(socket.rooms);
    socket.join(noomName) // 그룹 방 입장
    done(noomName); // front fn

    socket.to(noomName).emit('welcome'); // 자신을 제외한 같은 방 모두에게
  })
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_msg', msg)
    done();
    socket.to(room).emit('sendMsg', msg);
  })
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => {
      socket.to(room).emit('bye')
    })
  })
})




// ============================================= WebSocket
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server }); // [{ server }] http & ws = If you want to run on the same port, WebSocket on the Http 

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser");

//   sockets.forEach((aSocket) =>
//     aSocket.send(`New ${socket.nickname} is entered.`)
//   );

//   socket.on('message', (msg) => {
//     const message = JSON.parse(msg.toString('utf8'))

//     if(message.type === 'new_message') {
//         sockets.forEach(aSocket => {
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         });
//     } else if(message.type === 'nickname') {
//         console.log(message.payload);
//         socket['nickname'] = message.payload;
//     }
//   });

//   socket.on("close", () => {
//     const originNick = socket["nickname"];
//     sockets.forEach((aSocket) => aSocket.send(`${originNick} leave the chat`));
//     // console.log("Disconected from Browser");
//   });
// })

// const handleListen = () => console.log(`Listening on http://localhost:3000`);
// server.listen(3000, handleListen);