const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { playlistSongsActivitiesTable } = require('../../migrations/1703660504812_create-table-playlist-songs-activities');
const InvariantError = require('../exceptions/invariant_error');
const { usersTable } = require('../../migrations/1703575916427_create-table-users');
const { songsTable } = require('../../migrations/1703266316584_create-table-songs');

class PlaylistActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const activityId = `playlist-activity-${nanoid(16)}`;
    const datetime = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${playlistSongsActivitiesTable} VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [activityId, playlistId, songId, userId, action, datetime],
    };
    const result = await this._pool.query(query);
    const id = result.rows[0];
    if (!id) {
      throw new InvariantError('Failed to add playlist activity');
    }
    return id;
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT ${usersTable}.username, ${songsTable}.title, ${playlistSongsActivitiesTable}.action, ${playlistSongsActivitiesTable}.time
            FROM ${playlistSongsActivitiesTable}
            RIGHT JOIN ${usersTable} ON ${usersTable}.id = ${playlistSongsActivitiesTable}.user_id
            RIGHT JOIN ${songsTable} ON ${songsTable}.id = ${playlistSongsActivitiesTable}.song_id
            WHERE ${playlistSongsActivitiesTable}.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivityService;
