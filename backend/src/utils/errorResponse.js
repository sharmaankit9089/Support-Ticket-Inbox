const errorResponse = (res, message, status = 400, details = []) => {
  return res.status(status).json({
    error: message,
    details
  });
};

export default errorResponse;
