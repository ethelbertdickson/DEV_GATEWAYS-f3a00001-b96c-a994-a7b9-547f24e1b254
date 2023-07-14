// app/models/Gateway.js

const mongoose = require('mongoose');

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
				validator: function (value) {
					const ipv4Regex =
						/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
					return ipv4Regex.test(value);
				},
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
	{ versionKey: false } // Exclude the __v field
);

module.exports = mongoose.model('Gateway', gatewaySchema);
