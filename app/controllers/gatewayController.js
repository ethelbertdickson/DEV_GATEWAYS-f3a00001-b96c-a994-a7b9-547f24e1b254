// app/controllers/gatewayController.js
const GatewayService = require('../services/gatewayServices');
const logger = require('../../config/bunyan');

// create gateway controller
const createGateway = async (req, res) => {
	try {
		const { name, ipv4Address, devices } = req.body;

		if (!name || !ipv4Address || !devices) {
			throw new Error(
				'Invalid request body. Please provide all required fields.'
			);
		}

		if (typeof ipv4Address !== 'string') {
			throw new Error(
				'Invalid IPv4 address. Please input a valid IPv4 address as a string.'
			);
		}

		const gatewayData = { name, ipv4Address, devices };
		const createdGateway = await GatewayService.createGatewayService(
			gatewayData
		);

		res.status(200).json(createdGateway);
	} catch (error) {
		logger.error(error);

		if (
			error.message ===
			'A device with the same name or IPv4 address already exists.'
		) {
			// Return a 409 conflict status code
			res.status(409).json({ error: error.message });
		} else {
			// Return a 400 bad request status code for other errors
			res.status(400).json({ error: error.message });
		}
	}
};

//get all gateways controller
const getAllGateways = async (req, res, next) => {
	try {
		const gateways = await GatewayService.getAllGateways();
		res.json(gateways);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Internal error', error });
	}
};

//get all devices from gateway
const getDevicesFromGateway = async (req, res, next) => {
	try {
		const gatewayId = req.params.id;
		const devices = await GatewayService.getDevicesFromGateway(gatewayId);
		res.json(devices);
	} catch (error) {
		if (error.message === 'Gateway not found') {
			return res.status(404).json({ error: 'Gateway not found.' });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

//get Gateway by Id
const getGatewayById = async (req, res, next) => {
	try {
		const gateway = await GatewayService.getGatewayById(req.params.id);
		res.json(gateway);
	} catch (error) {
		if (error.message === 'Gateway not found') {
			return res.status(404).json({ error: 'Gateway not found.' });
		}
		if (error.name === 'CastError' && error.kind === 'ObjectId') {
			return res.status(400).json({ error: 'Invalid gateway ID.' });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

//get device from gateway by Id
const getDeviceById = async (req, res, next) => {
	try {
		const gatewayId = req.params.id;
		const deviceId = req.params.deviceId;
		const device = await GatewayService.getDeviceById(gatewayId, deviceId);
		res.json(device);
	} catch (error) {
		if (error.statusCode && error.statusCode === 404) {
			return res.status(404).json({ error: 'Device not found.' });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

//delete gateway controller
const deleteGateway = async (req, res) => {
	try {
		const gatewayId = req.params.id;
		await GatewayService.deleteGateway(gatewayId);
		res.json({ message: 'Gateway deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Gateway not found.' });
	}
};

// add devices to gateway
const addDeviceToGateway = async (req, res) => {
	try {
		const gatewayId = req.params.id;
		const deviceData = req.body;
		const gateway = await GatewayService.addDeviceToGateway(
			gatewayId,
			deviceData
		);
		res.json(gateway);
	} catch (error) {
		if (error.message.includes('Maximum number of devices reached')) {
			return res
				.status(400)
				.json({ error: 'Maximum number of devices reached.' });
		} else if (
			error.message.includes('Device with the same vendor already exists')
		) {
			return res
				.status(400)
				.json({ error: 'Device with the same vendor already exists.' });
		} else if (error.message.includes('Validation failed')) {
			return res.status(400).json({ error: error.message });
		} else {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
};

module.exports = {
	addDeviceToGateway,
};

//update gateway controller
const updateGatewayById = async (req, res, next) => {
	try {
		const gatewayId = req.params.id;
		const gatewayData = req.body;
		const updatedGateway = await GatewayService.updateGatewayById(
			gatewayId,
			gatewayData
		);
		res.json(updatedGateway);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: `Internal Server Error: ${error.message}` });
	}
};

//update device controller
const updateDeviceById = async (req, res, next) => {
	try {
		const gatewayId = req.params.id;
		const deviceId = req.params.deviceId;
		const deviceData = req.body;
		const updatedDevice = await GatewayService.updateDeviceById(
			gatewayId,
			deviceId,
			deviceData
		);
		res.json(updatedDevice);
	} catch (error) {
		if (error.statusCode && error.statusCode === 404) {
			return res.status(404).json({ error: 'Device not found.' });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

//remove devices from gateway
const removeDeviceFromGateway = async (req, res, next) => {
	try {
		const gatewayId = req.params.id;
		const deviceId = req.params.deviceId;
		await GatewayService.removeDeviceFromGateway(gatewayId, deviceId);
		res.json({ message: 'Device removed from gateway successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Device not found.' });
	}
};

module.exports = {
	createGateway,
	getAllGateways,
	getGatewayById,
	getDeviceById,
	getDevicesFromGateway,
	deleteGateway,
	addDeviceToGateway,
	updateGatewayById,
	updateDeviceById,
	removeDeviceFromGateway,
};
