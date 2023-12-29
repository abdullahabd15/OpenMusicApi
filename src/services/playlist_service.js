const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/invariant_error');
const { playlistTable } = require('../../migrations/1703577464396_create-table-playlists');
const { usersTable } = require('../../migrations/1703575916427_create-table-users');
const { collaborationsTable } = require('../../migrations/1703660524329_create-table-collaborations');
const NotFoundError = require('../exceptions/not_found_error');
const ForbiddenError = require('../exceptions/forbidden_error');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylists(name, owner) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${playlistTable} VALUES($1, $2, $3) RETURNING id`,
      values: [playlistId, name, owner],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylists({ id: owner }) {
    const query = {
      text: `SELECT ${playlistTable}.id, ${playlistTable}.name, ${usersTable}.username FROM ${playlistTable}
            INNER JOIN ${usersTable} ON ${playlistTable}.owner = ${usersTable}.id
            LEFT JOIN ${collaborationsTable} ON ${collaborationsTable}.playlist_id = ${playlistTable}.id
            WHERE ${playlistTable}.owner = $1 OR ${collaborationsTable}.user_id = $1`,
      values: [owner],
    };
    const results = await this._pool.query(query);
    return results.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT ${playlistTable}.id, ${playlistTable}.name, ${usersTable}.username FROM ${playlistTable}
            INNER JOIN ${usersTable} ON ${playlistTable}.owner = ${usersTable}.id
            WHERE ${playlistTable}.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Playlist not found');
    }
    return result.rows[0];
  }

  async deletePlaylistsById(id) {
    const query = {
      text: `DELETE FROM ${playlistTable} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to delete playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: `SELECT * FROM ${playlistTable} WHERE id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Playlist not found');
    }
    const playlistOwner = result.rows[0].owner;
    if (playlistOwner !== owner) {
      throw new ForbiddenError('You don\'t have the right to access this playlist');
    }
  }

  async verifyPlaylistsAccess(playlistId, userId, collaborationService) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      try {
        await collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
