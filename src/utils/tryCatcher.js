import logger from "./logger.js";

const tryCatch = (controller) => async (req, res, next) => {
	try {
		logger.info(`Handling request for ${req.method} ${req.originalUrl}`);
		await controller(req, res);
		logger.info(
			`Request handled successfully for ${req.method} ${req.originalUrl}`,
		);
	} catch (err) {
		next(err);
	}
};

export default tryCatch;
