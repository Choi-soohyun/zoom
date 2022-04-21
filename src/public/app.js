// console.log(io);- 자동적으로 backend socket.io 와 연결해주는 fn
const socket = io();

const welcome = document.querySelector('#welcome')
const form = welcome.querySelector('form')
const room = document.querySelector('#room')

room.hidden = true

let roomName;

function addMessage(msg) {
   const ul = room.querySelector('ul')
   const li = document.createElement('li')
   li.innerText = msg
   ul.appendChild(li)
}

function handleMessageSubmit(event) {
   event.preventDefault();
   const input = room.querySelector('input')
   socket.emit('new_message', input.value, roomName, () => {
      addMessage(`Me: ${input.value}`)
   })
   input.value = '';
}

function showRoom(msg) {
   console.log(`The backend says: ${msg}, Backend is done!`);

   const h3 = room.querySelector('h3')
   h3.innerText = `Room ${roomName}`

   room.hidden = false
   welcome.hidden = true

   const form = room.querySelector('form')
   form.addEventListener('submit', handleMessageSubmit)
}

function handleNoomSubmit(event) {
   event.preventDefault();
   const input = form.querySelector('input')
   socket.emit('enter_noom', input.value, showRoom) // fn  마지막
   roomName = input.value;
   input.value = '';
}

form.addEventListener('submit', handleNoomSubmit)

socket.on('welcome', () => {
   addMessage('Someone joined!')
})
socket.on('bye', () => {
   addMessage('Someone left!')
})
socket.on('sendMsg', (msg) => {
   addMessage(`You: ${msg}`)
})
// socket.on('sendMsg',addMessage(`You: ${msg}`)) 위와 같음