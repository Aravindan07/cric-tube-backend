const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
	const token = req.header("x-auth-token") || req.headers.authorization.split(" ")[1];
	// const token = req.headers.authorization.split(" ")[1];

	//Check for token
	if (!token) {
		return res.status(401).json({ message: "Token is invalid" });
	}

	try {
		//Verify token
		const jwtSecretKey = process.env.JWTSECRET;
		const decoded = jwt.verify(token, jwtSecretKey);
		// Add user from payload
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token is not Valid, Sign in again" });
	}
}

module.exports = checkAuth;
