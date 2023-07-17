// app/models/Gateway.js

const mongoose = require('mongoose');
const {
	nameValidator,
	vendorValidator,
	validateIpv4Address,
} = require('../utils/validationUtils');

const gatewaySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => {
					const { error } = nameValidator.validate(value);
					if (error) {
						throw new Error(`${error.details[0].message}`);
					}
					return true;
				},
			},
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
					validate: {
						validator: (value) => {
							const { error } = vendorValidator.validate(value);
							if (error) {
								throw new Error(` ${error.details[0].message}`);
							}
							return true;
						},
					},
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
