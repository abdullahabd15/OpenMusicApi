const { forbiddenCode } = require('../utils/consts');
const ClientError = require('./client_error');

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, forbiddenCode);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
