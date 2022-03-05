class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const returnErr = (res, code, err) => {
  res.status(code).json({
    success: false,
    error: err
  });
  return;
};

module.exports = { ErrorResponse, returnErr };
