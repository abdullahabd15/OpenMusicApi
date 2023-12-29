const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { playlistSongsTable } = require('../../migrations/1703660264036_create-table-playlist-songs');
const InvariantError = require('../exceptions/invariant_error');
const { songsTable } = require('../../migrations/1703266316584_create-table-songs');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const playlistSongsId = `playlist-songs-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${playlistSongsTable} VALUES($1, $2, $3) RETURNING id`,
      values: [playlistSongsId, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add song to playlist');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT ${songsTable}.id, ${songsTable}.title, ${songsTable}.performer FROM ${playlistSongsTable}
            INNER JOIN ${songsTable} ON ${playlistSongsTable}.song_id = ${songsTable}.id
            WHERE ${playlistSongsTable}.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM ${playlistSongsTable} WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Failed to delete song from playlist');
    }
  }
}

module.exports = PlaylistSongsService;
