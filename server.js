const express = require('express');
const path = require('path');

const app = express();

// Definindo protocolo HTTP
const server = require('http').createServer(app);

// Definindo protocolo WWS (WebSocket)
const io = require('socket.io')(server);

// Definindo front-end
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (request, response) => {
  response.render('index.html');
});

let messages = [];

// Função do socket.io que fica escutando as ações
io.on('connection', socket => {
  console.log("Socket conectado!");
  const {
    id,
    connected,
    disconnected,
    handshake: {
      time,
    }
  } = socket;
  console.log("Informações importantes: ", {
    id,
    connected,
    disconnected,
    time
  });

  // Enviando dados para um único conectado
  socket.emit('previousMessages', messages)

  // Ouvindo as mensagens vindas do front-end
  socket.on('sendMessage', data => {
    messages.push(data)

    // Retornando para todos os conectados uma resposta
    socket.broadcast.emit('receivedMessage', data)
  });
})

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});