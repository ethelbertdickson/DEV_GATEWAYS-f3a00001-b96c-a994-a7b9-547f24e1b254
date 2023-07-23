//config/database.js

const logger = require('../config/bunyan');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Database connection setup
const connectToDatabase = () => {
	const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;
	const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	db.on('error', (error) =>
		console.error('MongoDB connection error: Start the service')
	);
	db.once('open', () => console.log('Connected to MongoDB'));
};

module.exports = connectToDatabase;
