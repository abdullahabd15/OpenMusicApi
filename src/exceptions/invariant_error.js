import ClientError from './client_error.js';

export default class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}
