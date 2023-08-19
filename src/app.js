import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils/utils.js';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io';

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Server activo en puerto: http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

const messages = [];

socketServer.on('connection', (socket) => {
  console.log('Nueva conexion socket');

  socket.on('greetings', (user) => {
    socket.emit('greet', user);
    if (messages.length) {
      socket.broadcast.emit('messages', messages);
      socket.emit('messages', messages);
    }
  });

  socket.on('newUser', (user) => {
    socket.broadcast.emit('newUser', user);
  });

  socket.on('message', ({ user, message }) => {
    messages.push({ user, message, id: socket.id });
    socket.broadcast.emit('messages', messages);
    socket.emit('messages', messages);
  });
});
