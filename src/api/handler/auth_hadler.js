const autoBind = require('auto-bind');
const { successStatus, createdCode, successCode } = require('../../utils/consts');

class AuthenticationHandler {
  constructor(authService, usersService, tokenManager, validator) {
    this._authService = authService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validateAuthenticationPayload(request.payload);
    const id = await this._usersService.verifyUser(request.payload);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    await this._authService.addToken(refreshToken);
    const response = h.response({
      status: successStatus,
      data: {
        accessToken, refreshToken,
      },
    });
    response.code(createdCode);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validateRefreshTokenPayload(request.payload);
    await this._authService.verifyToken(request.payload);
    const result = this._tokenManager.verifyRefreshToken(request.payload);
    const accessToken = this._tokenManager.generateAccessToken(result);
    const response = h.response({
      status: successStatus,
      data: { accessToken },
    });
    response.code(successCode);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateRefreshTokenPayload(request.payload);
    await this._authService.verifyToken(request.payload);
    await this._authService.deleteToken(request.payload);
    const response = h.response({
      status: successStatus,
      message: 'Token has been deleted',
    });
    response.code(successCode);
    return response;
  }
}

module.exports = AuthenticationHandler;
