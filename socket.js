/* eslint-disable global-require */
module.exports = function startSocketServer(server) { // Create and export function to start socket
  const io = require('socket.io')(server, { // Creating socket connection
    cors: {
      origin: ['http://localhost:3000', 'https://hypelearn.herokuapp.com/'], // From wich origins Socket connection is allowed
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // for chat

    const id = socket.handshake.query.email; // Query email specified in query field in frontend
    socket.join(id);

    socket.on('send-message', ({ recipients, text }) => { // Creating connection on send-message socket
      const newRecipients = [];
      newRecipients.push(id);
      socket.broadcast.to(recipients).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      });
    });

    // for WebRTC

    socket.on('join-room', (roomId, userId) => {
      console.log('join-room', roomId, userId);
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });

    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
      socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', (data) => {
      console.log('callUser', data);
      io.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    });

    socket.on('answerCall', (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    });
  });
};
