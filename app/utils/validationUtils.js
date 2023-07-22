// Validation utility functions

const Joi = require('joi');

const nameValidator = Joi.string().min(3).max(30).required().messages({
	'string.base': 'Name must be a string',
	'string.empty': 'Name is required',
	'string.min': 'Name should have a minimum of 3 characters',
	'string.max': 'Name should have a maximum of 30 characters',
	'any.required': 'Name is required',
});

const vendorValidator = Joi.string().min(3).required().messages({
	'string.base': 'Vendor must be a string',
	'string.empty': 'Vendor is required',
	'string.min': 'Vendor should have a minimum of 3 characters',
	'any.required': 'Vendor is required',
});

const validateIpv4Address = (ipv4Address) => {
	const ipv4Regex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	const schema = Joi.string().pattern(ipv4Regex);

	const { error } = schema.validate(ipv4Address);
	return error === undefined;
};

module.exports = {
	nameValidator,
	vendorValidator,
	validateIpv4Address,
};
