// Validation utility functions
const validateIpv4Address = (ipv4Address) => {
	const ipv4Regex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return ipv4Regex.test(ipv4Address);
};

module.exports = {
	validateIpv4Address,
};
