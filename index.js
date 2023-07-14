require('dotenv').config();
const express = require('express');
const bunyan = require('bunyan');
const connectToDatabase = require('./config/database');
const gatewayRoutes = require('./app/routes/gatewayRoutes');

const app = express();

//Bunyan logger
const logger = bunyan.createLogger({
	name: 'musala',
	level: 'info',
	streams: [
		// { stream: process.stdout },
		{ type: 'file', path: './logfile.log' },
	],
});

// Connect to database
connectToDatabase();

// Middleware
app.use(express.json());

//redirect logs to bunyan
// console.log = logger.info.bind(logger);

// Routes
app.use('/gateways', gatewayRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error({ error: err }, 'Internal Server Error');
	res.status(500).json({ error: 'Internal Server Error' });
});

//Uncaught exceptions
process.on('uncaughtException', (err) => {
	logger.error({ error: err }, 'Uncaught Exception');
	process.exit(1);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
