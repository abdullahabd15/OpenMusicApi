const { Pool } = require('pg');
const InvariantError = require('../../exceptions/invariant_error');
const { authTable } = require('../../../migrations/1703577293172_create-table-authentications');

class AuthenticationService {
  constructor() {
    this._pool = new Pool();
  }

  async addToken(token) {
    const query = {
      text: `INSERT INTO ${authTable} VALUES($1) RETURNING token`,
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to save token');
    }
  }

  async verifyToken({ refreshToken }) {
    const query = {
      text: `SELECT * from ${authTable} WHERE token = $1`,
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Invalid token');
    }
  }

  async deleteToken({ refreshToken }) {
    const query = {
      text: `DELETE FROM ${authTable} WHERE token = $1 RETURNING token`,
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete token');
    }
  }
}

module.exports = AuthenticationService;
