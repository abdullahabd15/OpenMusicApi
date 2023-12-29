const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { collaborationsTable } = require('../../migrations/1703660524329_create-table-collaborations');
const InvariantError = require('../exceptions/invariant_error');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    const collabId = `collaboration-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${collaborationsTable} VALUES($1, $2, $3) RETURNING id`,
      values: [collabId, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add Collaboration');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: `DELETE FROM ${collaborationsTable} WHERE playlist_id = $1 AND user_id = $2 RETURNING id`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to delete Collaboration');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * FROM ${collaborationsTable} WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to verify collaborator');
    }
  }
}

module.exports = CollaborationsService;
