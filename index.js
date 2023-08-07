require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./config/bunyan');
const connectToDatabase = require('./config/database');
const gatewayRoutes = require('./app/routes/gatewayRoutes');

const app = express();

// Connect to database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());

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
