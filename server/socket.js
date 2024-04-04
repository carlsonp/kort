const { Server } = require('socket.io');

function setupSocketServer(httpServer) {
	const socketIo = new Server(httpServer);

	socketIo.on('connect', (socket) => {
	  console.debug('Socket connected: %s', socket.id);
	  socket.on('disconnect', () => {
	    console.debug('Socket disconnected: %s', socket.id);
	  });
	})
}

module.exports = { setupSocketServer };
