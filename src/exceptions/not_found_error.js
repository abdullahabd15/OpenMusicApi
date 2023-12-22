const ClientError = require('./client_error');
const { notFoundCode } = require('../utils/consts');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, notFoundCode);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
