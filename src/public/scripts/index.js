const socket = io();

const greet = document.getElementById('greet');
const chatBox = document.getElementById('chatBox');
const messageLogs = document.getElementById('messageLogs');

Swal.fire({
  title: 'Identifícate',
  text: 'Ingresa tu nombre',
  input: 'text',
  inputValidator: (value) => {
    return !value && '¡Ingresa un nombre!';
  },
}).then((data) => {
  user = data.value;
  socket.emit('greetings', user);
  socket.emit('newUser', user);
});

chatBox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user, message: chatBox.value.trim() });
      chatBox.value = '';
    }
  }
});

function sendMessage() {
  let message = document.getElementById('message').value;
  socket.emit('message', message);
}

socket.on('greet', (user) => {
  greet.innerHTML = `Bienvenido ${user}!`;
});

socket.on('newUser', (user) => {
  Swal.fire({
    position: 'bottom-end',
    title: `${user} has entered the room.`,
    showConfirmButton: false,
    timer: 1500,
  });
});

socket.on('messages', (data) => {
  let output = `<ul class="list-group" >`;
  data.forEach((item) => {
    if (item.id === socket.id) {
      output += `<li class="list-group-item" style="text-align: right;" > ${item.message}</li>`;
    } else {
      output += `<li class="list-group-item" >${item.user}: ${item.message}</li>`;
    }
  });

  output += `</ul>`;
  document.getElementById('messageLogs').innerHTML = output;
});
