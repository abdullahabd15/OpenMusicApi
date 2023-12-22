const autoBind = require('auto-bind');
const { createdCode, successCode, successStatus } = require('../utils/consts');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbum(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: successStatus,
      message: 'Album added succesfully',
      data: { albumId },
    });
    response.code(createdCode);
    return response;
  }

  async getAlbumHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const response = h.response({
      status: successStatus,
      data: {
        album: {
          id: album[0].id,
          name: album[0].name,
          year: album[0].year,
          songs: album.filter((e) => e.song_id !== null).map((a) => ({
            id: a.song_id,
            title: a.title,
            performer: a.performer,
          })),
        },
      },
    });
    response.code(successCode);
    return response;
  }

  async putAlbumHandler(request, h) {
    this._validator.validateAlbum(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;
    await this._service.editAlbumById(id, { name, year });
    const response = h.response({
      status: successStatus,
      message: 'Album edited successfully',
    });
    response.code(successCode);
    return response;
  }

  async deleteAlbumHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: successStatus,
      message: 'Album deleted successfully',
    });
    response.code(successCode);
    return response;
  }
}

module.exports = AlbumHandler;
