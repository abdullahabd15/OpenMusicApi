const autoBind = require('auto-bind');
const { successStatus, createdCode } = require('../../utils/consts');

class ExportHandler {
  constructor(producerService, playlistService, collaborationService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._collaborationService = collaborationService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    await this._playlistService.verifyPlaylistsAccess(
      playlistId,
      userId,
      this._collaborationService,
    );
    const message = { playlistId, targetEmail };
    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));
    const response = h.response({
      status: successStatus,
      message: 'Your request is on process',
    });
    response.code(createdCode);
    return response;
  }
}

module.exports = ExportHandler;
