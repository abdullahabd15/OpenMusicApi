const { unauthorizedCode } = require('../utils/consts');
const ClientError = require('./client_error');

class UnauthorizedError extends ClientError {
  constructor(message) {
    super(message, unauthorizedCode);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
