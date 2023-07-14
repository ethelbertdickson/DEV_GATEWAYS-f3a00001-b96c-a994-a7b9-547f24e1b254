## PROJECT SETUP

## Introduction

This is a nodejs REST service for storing information about these gateways and their associated devices.

## Setup and Installation:

- Install mongodb by downloading from its official website for a mac or windows machine
- Make sure it is saved in your system path
- Start mongodb by running mongod or mongodb in the terminal or microsoft shell
- open mongodb using compass
- create a new database and name it musala
- and import the collection in dbcollection.json in the root directory
- Download the project into your local web server
- Open the folder using Visual Studio Code
- Run npm install to install its dependencies
- serve the node server by running nodemon index

- Use postman or any other REST client app to run request using the following end points:
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
