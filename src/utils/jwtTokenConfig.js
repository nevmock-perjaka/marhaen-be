import jwt from "jsonwebtoken";

const generateToken = (data, time = "1h") => {
	return jwt.sign(data, process.env.JWT_SECRET, {
		expiresIn: time,
	});
};

const parseJWT = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.error("Invalid token:", error.message);
		return null;
	}
};

export { generateToken, parseJWT };
