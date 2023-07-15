// app/services/gatewayService.js

const Gateway = require('../models/Gateways');
const logger = require('../../config/bunyan');

// create gateway Service methods
const createGatewayService = async (gatewayData) => {
	const { name, ipv4Address } = gatewayData;

	// Check if any device with the same name and IPv4 address already exists
	const existingDevice = await Gateway.findOne({
		$or: [{ name: name }, { ipv4Address: ipv4Address }],
	});

	if (existingDevice) {
		const error = new Error(
			'A device with the same name or IPv4 address already exists.'
		);
		logger.error(error, 'Device creation failed');
		throw error;
	}

	const createdGateway = await Gateway.create(gatewayData);
	return createdGateway;
};

//get all gateways
const getAllGateways = async () => {
	return Gateway.find();
};

//get all device from gateway
const getDevicesFromGateway = async (gatewayId) => {
	const gateway = await Gateway.findById(gatewayId);

	if (!gateway) {
		const error = new Error('Gateway not found');
		error.statusCode = 404;
		throw error;
	}

	return gateway.devices;
};

const getGatewayById = async (gatewayId) => {
	const gateway = await Gateway.findById(gatewayId);
	if (!gateway) {
		throw new Error('Gateway not found');
	}
	return gateway;
};

//get device from gateway by uid
const getDeviceById = async (gatewayId, deviceId) => {
	const gateway = await Gateway.findById(gatewayId);

	if (!gateway) {
		const error = new Error('Gateway not found');
		error.statusCode = 404;
		throw error;
	}

	const device = gateway.devices.find(
		(device) => device.uid.toString() === deviceId
	);

	if (!device) {
		const error = new Error('Device not found');
		error.statusCode = 404;
		throw error;
	}

	logger.info('Gateway:', gateway);
	logger.info('Devices:', gateway.devices);

	return device;
};

//add devices to gateway
const addDeviceToGateway = async (gatewayId, deviceData) => {
	const gateway = await Gateway.findById(gatewayId);
	if (!gateway) {
		throw new Error('Gateway not found');
	}
	if (gateway.devices.length >= 10) {
		throw new Error('Maximum number of devices reached');
	}

	const existingDevice = gateway.devices.find(
		(device) => device.vendor === deviceData.vendor
	);

	if (existingDevice) {
		throw new Error('Device with the same vendor already exists');
	}

	gateway.devices.push(deviceData);
	return gateway.save();
};

//delete gateway service
const deleteGateway = async (gatewayId) => {
	const gateway = await Gateway.findById(gatewayId);

	if (!gateway) {
		const error = logger.error('Gateway not found');
		error.statusCode = 404;
		throw error;
	}

	await Gateway.findByIdAndDelete(gatewayId);
};

//update gateway service
const updateGatewayById = async (gatewayId, gatewayData) => {
	const gateway = await Gateway.findById(gatewayId);
	if (!gateway) {
		throw new Error('Gateway not found');
	}

	// Update the gateway properties
	if (gatewayData.name) {
		gateway.name = gatewayData.name;
	}
	if (gatewayData.ipv4Address) {
		gateway.ipv4Address = gatewayData.ipv4Address;
	}

	// Save the updated gateway
	await gateway.save();

	return gateway;
};

//update devices array service
const updateDeviceById = async (gatewayId, deviceId, deviceData) => {
	const gateway = await Gateway.findById(gatewayId);
	if (!gateway) {
		const error = new Error('Gateway not found');
		error.statusCode = 404;
		throw error;
	}

	const device = gateway.devices.find(
		(device) => device.uid.toString() === deviceId.toString()
	);

	if (!device) {
		const error = new Error('Device not found');
		error.statusCode = 404;
		throw error;
	}

	// Update the device properties
	if (deviceData.vendor) {
		device.vendor = deviceData.vendor;
	}

	// Save the updated gateway
	await gateway.save();

	return device;
};

//remove devices from gateway
const removeDeviceFromGateway = async (gatewayId, deviceId) => {
	const gateway = await Gateway.findById(gatewayId);

	if (!gateway) {
		const error = new Error('Gateway not found');
		error.statusCode = 404;
		throw error;
	}

	const deviceIndex = gateway.devices.findIndex(
		(device) => device.uid.toString() === deviceId
	);

	if (deviceIndex === -1) {
		const error = new Error('Device not found');
		error.statusCode = 404;
		throw error;
	}

	gateway.devices.splice(deviceIndex, 1);
	return gateway.save();
};

module.exports = {
	createGatewayService,
	getAllGateways,
	getGatewayById,
	getDevicesFromGateway,
	getDeviceById,
	deleteGateway,
	addDeviceToGateway,
	updateGatewayById,
	updateDeviceById,
	removeDeviceFromGateway,
};
