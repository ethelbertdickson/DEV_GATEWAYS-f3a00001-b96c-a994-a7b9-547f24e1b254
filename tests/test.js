// app/controllers/gatewayController.test.js
const gatewayController = require('../app/controllers/gatewayController');
const GatewayService = require('../app/services/gatewayServices');

describe('Gateway Controller', () => {
	// create gateway test

	describe('createGateway', () => {
		it('should create a gateway', async () => {
			// Test data
			const req = {
				body: {
					name: 'Gateway 1',
					ipv4Address: '192.168.0.1',
					devices: [],
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const createdGateway = {
				_id: '1',
				name: 'Gateway 1',
				ipv4Address: '192.168.0.1',
				devices: [],
			};

			// Mocked function
			GatewayService.createGatewayService = jest
				.fn()
				.mockResolvedValue(createdGateway);

			// Execute the controller method
			await gatewayController.createGateway(req, res);

			// Assertions
			expect(GatewayService.createGatewayService).toHaveBeenCalledWith(
				req.body
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(createdGateway);
		});

		it('should handle invalid request body', async () => {
			// Test data
			const req = {
				body: {
					name: 'Gateway 1',
					ipv4Address: '192.168.0.1',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage =
				'Invalid request body. Please provide all required fields.';

			// Execute the controller method
			await gatewayController.createGateway(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
		});

		it('should handle invalid IPv4 address', async () => {
			// Test data
			const req = {
				body: {
					name: 'Gateway 1',
					ipv4Address: 123,
					devices: [],
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage =
				'Invalid IPv4 address. Please input a valid IPv4 address as a string.';

			// Execute the controller method
			await gatewayController.createGateway(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				body: {
					name: 'Gateway 1',
					ipv4Address: '192.168.0.1',
					devices: [],
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Spy on console.error
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			// Mocked function
			jest
				.spyOn(GatewayService, 'createGatewayService')
				.mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.createGateway(req, res);

			// Assertions
			expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: errorMessage });

			// Restore console.error
			consoleErrorSpy.mockRestore();
		});
	});

	describe('getAllGateways', () => {
		it('should get all gateways', async () => {
			// Test data
			const req = {};
			const res = {
				json: jest.fn(),
			};
			const gateways = [
				{
					_id: '1',
					name: 'Gateway 1',
					ipv4Address: '192.168.0.1',
					devices: [],
				},
				{
					_id: '2',
					name: 'Gateway 2',
					ipv4Address: '192.168.0.2',
					devices: [],
				},
			];

			// Mocked function
			GatewayService.getAllGateways = jest.fn().mockResolvedValue(gateways);

			// Execute the controller method
			await gatewayController.getAllGateways(req, res);

			// Assertions
			expect(res.json).toHaveBeenCalledWith(gateways);
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.getAllGateways = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getAllGateways(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal error' });
		});
	});

	describe('getDevicesFromGateway', () => {
		it('should get devices from a gateway', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
			};
			const devices = [
				{
					_id: '1',
					name: 'Device 1',
					vendor: 'Vendor 1',
					status: 'online',
				},
				{
					_id: '2',
					name: 'Device 2',
					vendor: 'Vendor 2',
					status: 'offline',
				},
			];

			// Mocked function
			GatewayService.getDevicesFromGateway = jest
				.fn()
				.mockResolvedValue(devices);

			// Execute the controller method
			await gatewayController.getDevicesFromGateway(req, res);

			// Assertions
			expect(res.json).toHaveBeenCalledWith(devices);
		});

		it('should handle "Gateway not found" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Gateway not found';
			const error = new Error(errorMessage);
			error.message = errorMessage;

			// Mocked function
			GatewayService.getDevicesFromGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getDevicesFromGateway(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'Gateway not found.' });
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.getDevicesFromGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getDevicesFromGateway(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
		});
	});

	describe('getGatewayById', () => {
		it('should get a gateway by ID', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
			};
			const gateway = {
				_id: '1',
				name: 'Gateway 1',
				ipv4Address: '192.168.0.1',
				devices: [],
			};

			// Mocked function
			GatewayService.getGatewayById = jest.fn().mockResolvedValue(gateway);

			// Execute the controller method
			await gatewayController.getGatewayById(req, res);

			// Assertions
			expect(res.json).toHaveBeenCalledWith(gateway);
		});

		it('should handle "Gateway not found" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Gateway not found';
			const error = new Error(errorMessage);
			error.message = errorMessage;

			// Mocked function
			GatewayService.getGatewayById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getGatewayById(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'Gateway not found.' });
		});

		it('should handle "Invalid gateway ID" error', async () => {
			// Test data
			const req = {
				params: {
					id: 'invalid-id',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Invalid gateway ID';
			const error = new Error(errorMessage);
			error.name = 'CastError';
			error.kind = 'ObjectId';

			// Mocked function
			GatewayService.getGatewayById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getGatewayById(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Invalid gateway ID.' });
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.getGatewayById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getGatewayById(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
		});
	});

	describe('getDeviceById', () => {
		it('should get a device from a gateway by ID', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
			};
			const res = {
				json: jest.fn(),
			};
			const device = {
				_id: '2',
				name: 'Device 2',
				vendor: 'Vendor 2',
				status: 'offline',
			};

			// Mocked function
			GatewayService.getDeviceById = jest.fn().mockResolvedValue(device);

			// Execute the controller method
			await gatewayController.getDeviceById(req, res);

			// Assertions
			expect(res.json).toHaveBeenCalledWith(device);
		});

		it('should handle "Device not found" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Device not found';
			const error = new Error(errorMessage);
			error.statusCode = 404;

			// Mocked function
			GatewayService.getDeviceById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getDeviceById(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'Device not found.' });
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.getDeviceById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.getDeviceById(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
		});
	});
	// delete gateway
	describe('deleteGateway', () => {
		it('should delete a gateway', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
			};

			// Mocked function
			GatewayService.deleteGateway = jest.fn();

			// Execute the controller method
			await gatewayController.deleteGateway(req, res);

			// Assertions
			expect(GatewayService.deleteGateway).toHaveBeenCalledWith(req.params.id);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Gateway deleted successfully',
			});
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.deleteGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.deleteGateway(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Gateway not found.' });
		});
	});
	// add device to gateway
	describe('addDeviceToGateway', () => {
		it('should add a device to a gateway', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Device 1',
					vendor: 'Vendor 1',
					status: 'online',
				},
			};
			const res = {
				json: jest.fn(),
			};
			const gateway = {
				_id: '1',
				name: 'Gateway 1',
				ipv4Address: '192.168.0.1',
				devices: [
					{
						_id: '2',
						name: 'Device 2',
						vendor: 'Vendor 2',
						status: 'offline',
					},
				],
			};

			// Mocked function
			GatewayService.addDeviceToGateway = jest.fn().mockResolvedValue(gateway);

			// Execute the controller method
			await gatewayController.addDeviceToGateway(req, res);

			// Assertions
			expect(GatewayService.addDeviceToGateway).toHaveBeenCalledWith(
				req.params.id,
				req.body
			);
			expect(res.json).toHaveBeenCalledWith(gateway);
		});

		it('should handle "Maximum number of devices reached" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Device 1',
					vendor: 'Vendor 1',
					status: 'online',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Maximum number of devices reached';
			const error = new Error(errorMessage);
			error.message = errorMessage;

			// Mocked function
			GatewayService.addDeviceToGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.addDeviceToGateway(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Maximum number of devices reached.',
			});
		});

		it('should handle "Device with the same vendor already exists" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Device 1',
					vendor: 'Vendor 1',
					status: 'online',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Device with the same vendor already exists';
			const error = new Error(errorMessage);
			error.message = errorMessage;

			// Mocked function
			GatewayService.addDeviceToGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.addDeviceToGateway(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Device with the same vendor already exists.',
			});
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Device 1',
					vendor: 'Vendor 1',
					status: 'online',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.addDeviceToGateway = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.addDeviceToGateway(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
		});
	});

	describe('updateGatewayById', () => {
		it('should update a gateway by ID', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Updated Gateway',
					ipv4Address: '192.168.0.2',
					devices: [],
				},
			};
			const res = {
				json: jest.fn(),
			};
			const updatedGateway = {
				_id: '1',
				name: 'Updated Gateway',
				ipv4Address: '192.168.0.2',
				devices: [],
			};

			// Mocked function
			GatewayService.updateGatewayById = jest
				.fn()
				.mockResolvedValue(updatedGateway);

			// Execute the controller method
			await gatewayController.updateGatewayById(req, res);

			// Assertions
			expect(GatewayService.updateGatewayById).toHaveBeenCalledWith(
				req.params.id,
				req.body
			);
			expect(res.json).toHaveBeenCalledWith(updatedGateway);
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
				},
				body: {
					name: 'Updated Gateway',
					ipv4Address: '192.168.0.2',
					devices: [],
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.updateGatewayById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.updateGatewayById(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: `Internal Server Error: ${errorMessage}`,
			});
		});
	});

	describe('updateDeviceById', () => {
		it('should update a device by ID', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
				body: {
					name: 'Updated Device',
					vendor: 'Updated Vendor',
					status: 'offline',
				},
			};
			const res = {
				json: jest.fn(),
			};
			const updatedDevice = {
				_id: '2',
				name: 'Updated Device',
				vendor: 'Updated Vendor',
				status: 'offline',
			};

			// Mocked function
			GatewayService.updateDeviceById = jest
				.fn()
				.mockResolvedValue(updatedDevice);

			// Execute the controller method
			await gatewayController.updateDeviceById(req, res);

			// Assertions
			expect(GatewayService.updateDeviceById).toHaveBeenCalledWith(
				req.params.id,
				req.params.deviceId,
				req.body
			);
			expect(res.json).toHaveBeenCalledWith(updatedDevice);
		});

		it('should handle "Device not found" error', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
				body: {
					name: 'Updated Device',
					vendor: 'Updated Vendor',
					status: 'offline',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const errorMessage = 'Device not found';
			const error = new Error(errorMessage);
			error.statusCode = 404;

			// Mocked function
			GatewayService.updateDeviceById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.updateDeviceById(req, res);

			// Assertions
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ error: 'Device not found.' });
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
				body: {
					name: 'Updated Device',
					vendor: 'Updated Vendor',
					status: 'offline',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.updateDeviceById = jest.fn().mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.updateDeviceById(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
		});
	});
	// remove device from gateway
	describe('removeDeviceFromGateway', () => {
		it('should remove a device from a gateway', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
			};
			const res = {
				json: jest.fn(),
			};

			// Mocked function
			GatewayService.removeDeviceFromGateway = jest.fn();

			// Execute the controller method
			await gatewayController.removeDeviceFromGateway(req, res);

			// Assertions
			expect(GatewayService.removeDeviceFromGateway).toHaveBeenCalledWith(
				req.params.id,
				req.params.deviceId
			);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Device removed from gateway successfully',
			});
		});

		it('should handle errors thrown by GatewayService', async () => {
			// Test data
			const req = {
				params: {
					id: '1',
					deviceId: '2',
				},
			};
			const res = {
				json: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};
			const errorMessage = 'Some error message';
			const error = new Error(errorMessage);

			// Mocked function
			GatewayService.removeDeviceFromGateway = jest
				.fn()
				.mockRejectedValue(error);

			// Execute the controller method
			await gatewayController.removeDeviceFromGateway(req, res);

			// Assertions
			expect(console.error).toHaveBeenCalledWith(error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Device not found.' });
		});
	});
});
