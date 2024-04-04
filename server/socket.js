const { Server } = require('socket.io');
const logger = require('./logger.js');

function setupSocketServer(httpServer) {
	const socketIo = new Server(httpServer);

	socketIo.on('connect', (socket) => {
	  logger.info('Socket connected: ' + socket.id);
	  socket.on('disconnect', () => {
	    logger.info('Socket disconnected: ' + socket.id);
	  });
	})
}

module.exports = { setupSocketServer };
