const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

console.log(process.env.MONGO_DATABASE);

// Database connection setup
const connectToDatabase = () => {
	const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;
	const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

	//show path
	console.log(uri);

	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.once('open', () => {
		console.log('Connected to MongoDB');
	});
};

// connectToDatabase();

module.exports = connectToDatabase;
