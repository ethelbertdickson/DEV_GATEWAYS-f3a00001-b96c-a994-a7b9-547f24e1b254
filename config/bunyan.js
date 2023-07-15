const bunyan = require('bunyan');

const logger = bunyan.createLogger({
	name: 'musala',
	level: 'info',
	streams: [{ type: 'file', path: '../logfile.log' }],
});

module.exports = logger;
