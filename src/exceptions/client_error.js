import consts from '../utils/consts.js';

const { badRequestCode } = consts;

export default class ClientError extends Error {
  constructor(message, statusCode = badRequestCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}
