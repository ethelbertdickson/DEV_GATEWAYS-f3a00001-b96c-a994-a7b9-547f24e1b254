// app/routes/gatewayRoutes.js

const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');

// Routes
router.post('/', gatewayController.createGateway);
router.post('/:id/devices', gatewayController.addDeviceToGateway);

router.get('/', gatewayController.getAllGateways);
router.get('/:id', gatewayController.getGatewayById);
router.get('/:id/devices', gatewayController.getDevicesFromGateway);
router.get('/:id/devices/:deviceId', gatewayController.getDeviceById);

router.patch('/:id', gatewayController.updateGatewayById);
router.patch('/:id/devices/:deviceId', gatewayController.updateDeviceById);

router.delete('/:id', gatewayController.deleteGateway);
router.delete(
	'/:id/devices/:deviceId',
	gatewayController.removeDeviceFromGateway
);

module.exports = router;
