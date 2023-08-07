# Project Setup

## Introduction

This repository contains a Node.js REST service for storing information about gateways and their associated devices.

## Setup and Installation

To set up the project, follow these steps:

1. Download and install MongoDB from the official website for your Mac or Windows machine.
2. Ensure that MongoDB is saved in your system path.
3. Start MongoDB by running `mongod` or `mongodb` in the terminal or Microsoft Shell.
4. Open MongoDB using Compass.
5. Create a new database and name it `musala`.
6. Import the collection from `sample.db.json` located in the root directory.
7. Download and clone the project into your local web server using terminal:

```
git clone https://github.com/ethelbertdickson/DEV_GATEWAYS-f3a00001-b96c-a994-a7b9-547f24e1b254
```

8. Open the project folder using Visual Studio Code.
9. Run the following `npm install` to install the project's dependencies:
10. Serve the Node server by running `nodemon index`

## Usage

Use POSTMAN or any other REST client app to interact with the API using the following endpoints:
{port} will be determined by the .env file in the root directory.

-   Create a new gateway:
    POST http://localhost:{port}/gateways

```
  {
    "name": "musala",
    "ipv4Address": "127.0.0.100",
    "devices":[]
  }
```

-   Add a new device to a gateway:
    POST http://localhost:{port}/gateways/{gatewayId}/devices

    ```
    {
      "vendor": "musala",
      "staus": "online",
    }
    ```

-   Get all gateways:
    GET http://localhost:{port}/gateways

-   Get all devices in a gateway:
    GET http://localhost:{port}/gateways/{gatewayId}

-   Get a specific device in a gateway:
    GET http://localhost:{port}/gateways/{gatewayId}/devices/

-   Update a gateway with ID:
    PATCH http://localhost:{port}{port}/gateways/{gatewayId}

    ```
    {
      "name": "musala-renamed",
      "ipv4Address": "127.0.0.100",
      "devices":[]
    }
    ```

-   Update a device in a gateway:
    PATCH http://localhost:{port}/gateways/{gatewayId}/devices/{deviceId}

    ```
    {
     "vendor": "musala-rename",
     "staus": "offline",
    }
    ```

-   Remove gateway:
    DELETE http://localhost:{port}/gateways/{gatewayId}

-   Remove a device from a gateway:
    DELETE http://localhost:{port}/gateways/{gatewayId}/devices/{deviceId}
