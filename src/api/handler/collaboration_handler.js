const autoBind = require('auto-bind');
const { successStatus, createdCode, successCode } = require('../../utils/consts');

class CollaborationHandler {
  constructor(collaborationService, playlistService, usersService, validator) {
    this._collabService = collaborationService;
    this._playlistService = playlistService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistService.verifyPlaylistOwner(playlistId, id);
    await this._usersService.verifyUserById(userId);
    const collaborationId = await this._collabService.addCollaboration(request.payload);
    const response = h.response({
      status: successStatus,
      data: { collaborationId },
    });
    response.code(createdCode);
    return response;
  }

  async deleteCollaboration(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistService.verifyPlaylistOwner(playlistId, id);
    await this._usersService.verifyUserById(userId);
    await this._collabService.deleteCollaboration(request.payload);
    const response = h.response({
      status: successStatus,
      message: 'Collaboration deleted successfuly',
    });
    response.code(successCode);
    return response;
  }
}

module.exports = CollaborationHandler;
