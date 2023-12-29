const autoBind = require('auto-bind');
const { successStatus, createdCode } = require('../../utils/consts');

class UsersHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUsersPayload(request.payload);
    const userId = await this._usersService.addUser(request.payload);
    const response = h.response({
      status: successStatus,
      data: { userId },
    });
    response.code(createdCode);
    return response;
  }
}

module.exports = UsersHandler;
