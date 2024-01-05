const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/invariant_error');
const UnauthorizedError = require('../../exceptions/unatuhorized_error');
const { usersTable } = require('../../../migrations/1703575916427_create-table-users');
const NotFoundError = require('../../exceptions/not_found_error');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username, password, fullname,
  }) {
    await this.validateUsername(username);
    const userId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO ${usersTable} VALUES($1, $2, $3, $4) RETURNING id`,
      values: [userId, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    const { id } = result.rows[0];
    if (!id) {
      throw new InvariantError('Failed to add user');
    }
    return id;
  }

  async validateUsername(username) {
    const query = {
      text: `SELECT username FROM ${usersTable} WHERE username = $1`,
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Username is already exist');
    }
  }

  async verifyUser({
    username, password,
  }) {
    const query = {
      text: `SELECT id, password FROM ${usersTable} where username = $1`,
      values: [username],
    };
    const result = await this._pool.query(query);
    const errorMessage = 'Username or password doesn\'t match with any user';
    if (result.rowCount === 0) {
      throw new UnauthorizedError(errorMessage);
    }
    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new UnauthorizedError(errorMessage);
    }
    return id;
  }

  async verifyUserById(userId) {
    const query = {
      text: `SELECT id from ${usersTable} WHERE id = $1`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('User not found');
    }
  }
}

module.exports = UsersService;
