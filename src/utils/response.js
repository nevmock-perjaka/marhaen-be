import statusCodes from "../errors/status-codes.js";

/**
 * Success response for successful operations
 * @param {any} data - The data to return in the response
 * @param {string} message - Success message
 * @param {object} pagination - Pagination data
 * @returns {object} - Formatted success response
 */
export function successResponse(res, data = "Request successful", recordsTotal = null, pagination = null) {
  return res.status(statusCodes.OK.code).json({
    code: statusCodes.OK.code,
    status: statusCodes.OK.message,
    recordsTotal: recordsTotal == null ? (Array.isArray(data) ? data.length : 1) : recordsTotal,
    data: data,
    ...(pagination ? { pagination } : {}),
    errors: null,
  });
}

/**
 * Created response for resource creation
 * @param {any} data - The newly created resource
 * @param {string} message - Success message
 * @returns {object} - Formatted created response
 */
export function createdResponse(res, data = "Resource created successfully", recordsTotal = null) {
  return res.status(statusCodes.CREATED.code).json({
    code: statusCodes.CREATED.code,
    status: statusCodes.CREATED.message,
    recordsTotal: recordsTotal == null ? (Array.isArray(data) ? data.length : 1) : recordsTotal,
    data: data,
    errors: null,
  });
}

/**
 * Error response for failed operations
 * @param {Response} res - Express response object
 * @param {number} code - HTTP status code (e.g. 400, 404)
 * @param {string} message - Error message
 * @param {any} errors - Optional detailed errors (can be string, array, or object)
 * @returns {object} - Formatted error response
 */
export function errorResponse(res, code = 500, message = "Internal Server Error", errors = null) {
  const status = Object.values(statusCodes).find((item) => item.code === code)?.message || "Error";

  return res.status(code).json({
    code,
    status,
    data: null,
    errors: errors || message,
  });
}
