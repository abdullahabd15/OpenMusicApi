const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/not_found_error');
const InvariantError = require('../exceptions/invariant_error');
const { mapToAlbum } = require('../utils/mapper');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({
    name, year,
  }) {
    const albumId = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [albumId, name, year],
    };
    const result = await this._pool.query(query);
    const { id } = result.rows[0];
    if (id !== albumId) {
      throw new InvariantError('Failed to add album');
    }
    return id;
  }

  async getAlbumById(albumId) {
    const query = {
      text: 'SELECT a.id, a.name, a.year, s.id song_id, s.title, s.performer FROM albums a LEFT JOIN songs s ON s.album_id = a.id WHERE a.id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Album not found');
    }
    return result.rows.map(mapToAlbum);
  }

  async editAlbumById(
    albumId,
    { name, year },
  ) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Failed to edit Album, Album not found');
    }
  }

  async deleteAlbumById(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Failed to delete album, Album not found');
    }
  }
}

module.exports = AlbumService;
