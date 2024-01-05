const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { albumLikesTable } = require('../../../migrations/1704274449125_create-table-user-album-likes');
const ClientError = require('../../exceptions/client_error');
const InvariantError = require('../../exceptions/invariant_error');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlbumLiked(userId, albumId) {
    const query = {
      text: `SELECT * FROM ${albumLikesTable} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async likeAlbum(userId, albumId) {
    const isLiked = await this.verifyAlbumLiked(userId, albumId);
    if (isLiked) throw new ClientError('Album already liked');
    const id = `album-likes-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${albumLikesTable} VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Failed to like album');
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async unlikeAlbum(userId, albumId) {
    const isLiked = this.verifyAlbumLiked(userId, albumId);
    if (!isLiked) throw new ClientError('Album not liked yet');
    const query = {
      text: `DELETE FROM ${albumLikesTable} WHERE user_id = $1 AND album_id = $2 RETURNING id`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Failed to unike album');
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), isCache: 1 };
    } catch (error) {
      const query = {
        text: `SELECT user_id FROM ${albumLikesTable} WHERE album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows));
      return { likes: result.rows };
    }
  }
}

module.exports = AlbumLikesService;
