const sendSuccess = (res, data = null, statusCode = 200, message = null) => {
  const response = {
    success: true,
    data,
    requestId: res.req.requestId,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
};