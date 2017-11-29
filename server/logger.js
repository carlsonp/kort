var winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();

var logger = new (winston.Logger)({  
    transports: [
        new (winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true
		}),
    ]
});

module.exports = logger;
