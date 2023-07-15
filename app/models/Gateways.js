// app/models/Gateway.js

const mongoose = require('mongoose');
const { validateIpv4Address } = require('../utils/validationUtils');

const gatewaySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		ipv4Address: {
			type: String,
			required: true,
			validate: {
				validator: validateIpv4Address,
				message: 'Invalid IPv4 address',
			},
		},

		devices: [
			{
				_id: false,
				uid: {
					type: mongoose.Schema.Types.ObjectId,
					auto: true,
				},
				vendor: {
					type: String,
					required: true,
				},
				createdDate: {
					type: Date,
					default: Date.now,
				},
				status: {
					type: String,
					enum: ['online', 'offline'],
					default: 'offline',
				},
			},
		],
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Gateway', gatewaySchema);
