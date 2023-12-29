const autoBind = require('auto-bind');
const { createdCode, successCode, successStatus } = require('../../utils/consts');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSong(request.payload);
    const songId = await this._service.addSong(request.payload);
    const response = h.response({
      status: successStatus,
      message: 'Song added successfully',
      data: { songId },
    });
    response.code(createdCode);
    return response;
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs(request.query);
    const response = h.response({
      status: successStatus,
      data: { songs },
    });
    response.code(successCode);
    return response;
  }

  async getSongHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: successStatus,
      data: { song },
    });
    response.code(successCode);
    return response;
  }

  async putSongHandler(request, h) {
    this._validator.validateSong(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: successStatus,
      message: 'Song edited successfully',
    });
    response.code(successCode);
    return response;
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: successStatus,
      message: 'Song deleted successfully',
    });
    response.code(successCode);
    return response;
  }
}

module.exports = SongHandler;
