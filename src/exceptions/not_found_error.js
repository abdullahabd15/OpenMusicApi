import ClientError from './client_error.js';
import consts from '../utils/consts.js';

const { notFoundCode } = consts;

export default class NotFoundError extends ClientError {
  constructor(message) {
    super(message, notFoundCode);
    this.name = 'NotFoundError';
  }
}
