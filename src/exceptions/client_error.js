const { badRequestCode } = require('../utils/consts');

class ClientError extends Error {
  constructor(message, statusCode = badRequestCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
