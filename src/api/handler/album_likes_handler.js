const autoBind = require('auto-bind');
const { successStatus, createdCode, successCode } = require('../../utils/consts');

class AlbumLikesHandler {
  constructor(albumLikesService, albumService) {
    this._albumLikesService = albumLikesService;
    this._albumService = albumService;

    autoBind(this);
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._albumService.getAlbumById(albumId);
    await this._albumLikesService.likeAlbum(userId, albumId);
    const response = h.response({
      status: successStatus,
      message: 'Album Liked',
    });
    response.code(createdCode);
    return response;
  }

  async postUnlikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._albumService.getAlbumById(albumId);
    await this._albumLikesService.unlikeAlbum(userId, albumId);
    const response = h.response({
      status: successStatus,
      message: 'Album Unliked',
    });
    response.code(successCode);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, isCache = 0 } = await this._albumLikesService.getAlbumLikes(albumId);
    const response = h.response({
      status: successStatus,
      data: { likes: likes.length },
    });
    response.code(successCode);
    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = AlbumLikesHandler;
