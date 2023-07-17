// Validation utility functions

const Joi = require('joi');

const validateIpv4Address = (ipv4Address) => {
	const ipv4Regex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	const schema = Joi.string().pattern(ipv4Regex);

	const { error } = schema.validate(ipv4Address);
	return error === undefined;
};

module.exports = {
	validateIpv4Address,
};
