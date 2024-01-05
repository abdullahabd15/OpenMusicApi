require('dotenv').config();
const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool(
      {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      },
    );
  }

  async getPlaylist(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const results = await this._pool.query(query);
    return results.rows[0];
  }

  async getPlaylistWithSongs(playlistId) {
    const playlist = await this.getPlaylist(playlistId);
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM playlists
      INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      INNER JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const results = await this._pool.query(query);
    return { ...playlist, songs: results.rows };
  }
}

module.exports = PlaylistService;
