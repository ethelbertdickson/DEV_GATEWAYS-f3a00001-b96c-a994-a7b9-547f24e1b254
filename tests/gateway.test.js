// app/services/gatewayService.test.js

const GatewayService = require('../app/services/gatewayServices');
const Gateway = require('../app/models/Gateways');

// Mock the Gateway model
jest.mock('../app/models/Gateways', () => ({
	findOne: jest.fn(),
	find: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
	findByIdAndDelete: jest.fn(),
}));

describe('GatewayService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createGateway', () => {
		it('should create a new gateway if no device with the same name or IPv4 address exists', async () => {
			const gatewayData = {
				name: 'Test Gateway',
				ipv4Address: '192.168.0.1',
			};

			Gateway.findOne.mockResolvedValue(null);
			Gateway.create.mockResolvedValue(gatewayData);

			const createdGateway = await GatewayService.createGateway(gatewayData);

			expect(createdGateway).toEqual(gatewayData);
			expect(Gateway.findOne).toHaveBeenCalledWith({
				$or: [
					{ name: gatewayData.name },
					{ ipv4Address: gatewayData.ipv4Address },
				],
			});
			expect(Gateway.create).toHaveBeenCalledWith(gatewayData);
		});

		it('should throw an error if a device with the same name or IPv4 address already exists', async () => {
			const gatewayData = {
				name: 'Test Gateway',
				ipv4Address: '192.168.0.1',
			};

			Gateway.findOne.mockResolvedValue({ name: 'Existing Gateway' });

			await expect(GatewayService.createGateway(gatewayData)).rejects.toThrow(
				'A device with the same name or IPv4 address already exists.'
			);
			expect(Gateway.findOne).toHaveBeenCalledWith({
				$or: [
					{ name: gatewayData.name },
					{ ipv4Address: gatewayData.ipv4Address },
				],
			});
			expect(Gateway.create).not.toHaveBeenCalled();
		});
	});

	describe('getAllGateways', () => {
		it('should get all gateways', async () => {
			const gateways = [{ name: 'Gateway 1' }, { name: 'Gateway 2' }];

			Gateway.find.mockResolvedValue(gateways);

			const result = await GatewayService.getAllGateways();

			expect(result).toEqual(gateways);
			expect(Gateway.find).toHaveBeenCalled();
		});
	});

	describe('getGatewayById', () => {
		it('should get a gateway by its ID if it exists', async () => {
			const gatewayId = '1234567890';
			const gateway = { _id: gatewayId, name: 'Test Gateway' };

			Gateway.findById.mockResolvedValue(gateway);

			const result = await GatewayService.getGatewayById(gatewayId);

			expect(result).toEqual(gateway);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';

			Gateway.findById.mockResolvedValue(null);

			await expect(GatewayService.getGatewayById(gatewayId)).rejects.toThrow(
				'Gateway not found'
			);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});
	});

	describe('getDevicesFromGateway', () => {
		it('should get all devices from a gateway if it exists', async () => {
			const gatewayId = '1234567890';
			const gateway = { _id: gatewayId, devices: ['Device 1', 'Device 2'] };

			Gateway.findById.mockResolvedValue(gateway);

			const result = await GatewayService.getDevicesFromGateway(gatewayId);

			expect(result).toEqual(gateway.devices);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.getDevicesFromGateway(gatewayId)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});
	});

	describe('getDeviceById', () => {
		it('should get a device from a gateway by its ID if both the gateway and device exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: deviceId, name: 'Test Device' }],
			};
			const expectedDevice = gateway.devices[0];

			Gateway.findById.mockResolvedValue(gateway);

			const result = await GatewayService.getDeviceById(gatewayId, deviceId);

			expect(result).toEqual(expectedDevice);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.getDeviceById(gatewayId, deviceId)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});

		it('should throw an error if the device with the specified ID does not exist in the gateway', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: '1111111111', name: 'Device 1' }],
			};

			Gateway.findById.mockResolvedValue(gateway);

			await expect(
				GatewayService.getDeviceById(gatewayId, deviceId)
			).rejects.toThrow('Device not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
		});
	});

	describe('addDeviceToGateway', () => {
		it('should add a device to a gateway if the gateway exists and the maximum device limit is not reached', async () => {
			const gatewayId = '1234567890';
			const deviceData = { vendor: 'Vendor 1' };

			const gateway = {
				_id: gatewayId,
				devices: [{ vendor: 'Existing Vendor' }],
				save: jest.fn().mockResolvedValue(),
			};

			Gateway.findById.mockResolvedValue(gateway);
			gateway.save.mockResolvedValue(gateway);

			const result = await GatewayService.addDeviceToGateway(
				gatewayId,
				deviceData
			);

			expect(result).toEqual(gateway);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(gateway.devices).toContainEqual(deviceData);
			expect(gateway.save).toHaveBeenCalled();
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';
			const deviceData = { vendor: 'Vendor 1' };

			const gateway = {
				_id: gatewayId,
				devices: [],
				save: jest.fn().mockRejectedValue(new Error('Gateway not found')),
			};

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.addDeviceToGateway(gatewayId, deviceData)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(gateway.save).not.toHaveBeenCalled();
		});

		it('should throw an error if the maximum number of devices is already reached in the gateway', async () => {
			const gatewayId = '1234567890';
			const deviceData = { vendor: 'Vendor 1' };
			const gateway = {
				_id: gatewayId,
				devices: Array(10).fill({ vendor: 'Existing Vendor' }),
				save: jest.fn(),
			};

			Gateway.findById.mockResolvedValue(gateway);

			await expect(
				GatewayService.addDeviceToGateway(gatewayId, deviceData)
			).rejects.toThrow('Maximum number of devices reached');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(gateway.save).not.toHaveBeenCalled();
		});

		it('should throw an error if a device with the same vendor already exists in the gateway', async () => {
			const gatewayId = '1234567890';
			const deviceData = { vendor: 'Vendor 1' };
			const gateway = {
				_id: gatewayId,
				devices: [{ vendor: 'Vendor 1' }],
				save: jest.fn(),
			};

			Gateway.findById.mockResolvedValue(gateway);

			await expect(
				GatewayService.addDeviceToGateway(gatewayId, deviceData)
			).rejects.toThrow('Device with the same vendor already exists');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(gateway.save).not.toHaveBeenCalled();
		});
	});

	describe('deleteGateway', () => {
		it('should delete a gateway if it exists', async () => {
			const gatewayId = '1234567890';
			const gateway = { _id: gatewayId, name: 'Test Gateway' };

			Gateway.findById.mockResolvedValue(gateway);

			await GatewayService.deleteGateway(gatewayId);

			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.findByIdAndDelete).toHaveBeenCalledWith(gatewayId);
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';

			const error = new Error('Gateway not found');
			error.statusCode = 404;

			Gateway.findById.mockResolvedValue(null);
			jest.spyOn(console, 'error').mockReturnValue();

			await expect(GatewayService.deleteGateway(gatewayId)).rejects.toThrow(
				'Gateway not found'
			);

			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(console.error).toHaveBeenCalledWith('Gateway not found');
		});
	});

	describe('updateGatewayById', () => {
		it('should update a gateway by its ID if it exists', async () => {
			const gatewayId = '1234567890';
			const gatewayData = {
				name: 'Updated Gateway',
				ipv4Address: '192.168.0.2',
			};
			const gateway = {
				_id: gatewayId,
				name: 'Test Gateway',
				ipv4Address: '192.168.0.1',
			};

			Gateway.findById.mockResolvedValue(gateway);
			gateway.name = gatewayData.name;
			gateway.ipv4Address = gatewayData.ipv4Address;
			Gateway.save.mockResolvedValue(gateway);

			const result = await GatewayService.updateGatewayById(
				gatewayId,
				gatewayData
			);

			expect(result).toEqual(gateway);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(gateway.name).toEqual(gatewayData.name);
			expect(gateway.ipv4Address).toEqual(gatewayData.ipv4Address);
			expect(Gateway.save).toHaveBeenCalledWith();
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';
			const gatewayData = { name: 'Updated Gateway' };

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.updateGatewayById(gatewayId, gatewayData)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).not.toHaveBeenCalled();
		});
	});

	describe('updateDeviceById', () => {
		it('should update a device by its ID within a gateway if both the gateway and device exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const deviceData = { vendor: 'Updated Vendor' };
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: deviceId, vendor: 'Test Vendor' }],
			};
			const expectedDevice = gateway.devices[0];

			Gateway.findById.mockResolvedValue(gateway);
			expectedDevice.vendor = deviceData.vendor;
			Gateway.save.mockResolvedValue(gateway);

			const result = await GatewayService.updateDeviceById(
				gatewayId,
				deviceId,
				deviceData
			);

			expect(result).toEqual(expectedDevice);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(expectedDevice.vendor).toEqual(deviceData.vendor);
			expect(Gateway.save).toHaveBeenCalledWith();
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const deviceData = { vendor: 'Updated Vendor' };

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.updateDeviceById(gatewayId, deviceId, deviceData)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).not.toHaveBeenCalled();
		});

		it('should throw an error if the device with the specified ID does not exist in the gateway', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const deviceData = { vendor: 'Updated Vendor' };
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: '1111111111', vendor: 'Test Vendor' }],
			};

			Gateway.findById.mockResolvedValue(gateway);

			await expect(
				GatewayService.updateDeviceById(gatewayId, deviceId, deviceData)
			).rejects.toThrow('Device not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).not.toHaveBeenCalled();
		});
	});

	describe('removeDeviceFromGateway', () => {
		it('should remove a device from a gateway if both the gateway and device exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: deviceId, vendor: 'Test Vendor' }],
			};

			Gateway.findById.mockResolvedValue(gateway);
			gateway.devices.splice(0, 1);
			Gateway.save.mockResolvedValue(gateway);

			const result = await GatewayService.removeDeviceFromGateway(
				gatewayId,
				deviceId
			);

			expect(result).toEqual(gateway);
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).toHaveBeenCalledWith();
		});

		it('should throw an error if the gateway with the specified ID does not exist', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';

			Gateway.findById.mockResolvedValue(null);

			await expect(
				GatewayService.removeDeviceFromGateway(gatewayId, deviceId)
			).rejects.toThrow('Gateway not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).not.toHaveBeenCalled();
		});

		it('should throw an error if the device with the specified ID does not exist in the gateway', async () => {
			const gatewayId = '1234567890';
			const deviceId = '0987654321';
			const gateway = {
				_id: gatewayId,
				devices: [{ uid: '1111111111', vendor: 'Test Vendor' }],
			};

			Gateway.findById.mockResolvedValue(gateway);

			await expect(
				GatewayService.removeDeviceFromGateway(gatewayId, deviceId)
			).rejects.toThrow('Device not found');
			expect(Gateway.findById).toHaveBeenCalledWith(gatewayId);
			expect(Gateway.save).not.toHaveBeenCalled();
		});
	});
});
