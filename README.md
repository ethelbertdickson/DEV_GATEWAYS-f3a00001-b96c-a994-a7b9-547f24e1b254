## PROJECT SETUP

## Introduction

This is a nodejs REST service for storing information about these gateways and their associated devices.

The service has the following APIs:
//create a new gateway
POST http://localhost:3000/gateways

//add a new device to a gateway
POST http://localhost:3000/gateways/{gatewayId}/devices

//get all gateways
GET http://localhost:3000/gateways

//get a specific gateway with ID
GET http://localhost:3000/gateways/{gatewayId}

//get all devices in a gateway
GET http://localhost:3000/gateways/{gatewayId}/devices/

//get a specific device in a gateway
GET http://localhost:3000/gateways/{gatewayId}/devices/{deviceId}

//patch a gateway with ID
PATCH http://localhost:3000/gateways/{gatewayId}

//patch a device in a gateway
PATCH http://localhost:3000/gateways/{gatewayId}/devices/{deviceId}

//remove a device from a gateway
DELETE http://localhost:3000/gateways/{gatewayId}/devices/{deviceId}
