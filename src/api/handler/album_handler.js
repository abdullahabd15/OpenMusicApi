const autoBind = require('auto-bind');
const { createdCode, successCode, successStatus } = require('../../utils/consts');

class AlbumHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbum(request.payload);
    const albumId = await this._service.addAlbum(request.payload);
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
          coverUrl: album[0].coverUrl,
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
    await this._service.editAlbumById(id, request.payload);
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

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { albumId } = request.params;
    this._validator.validateAlbumCover(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._service.addAlbumCover(albumId, fileUrl);
    const response = h.response({
      status: successStatus,
      message: 'Cover album uploaded',
    });
    response.code(createdCode);
    return response;
  }
}

module.exports = AlbumHandler;
