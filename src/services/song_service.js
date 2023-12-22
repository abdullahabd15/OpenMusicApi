import { nanoid } from 'nanoid';
import pkg from 'pg';
import mapper from '../utils/mapper.js';
import NotFoundError from '../exceptions/not_found_error.js';
import InvariantError from '../exceptions/invariant_error.js';

const { Pool } = pkg;
const { mapToSong } = mapper;

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const songId = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [songId, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    const { id } = result.rows[0];
    if (id !== songId) {
      throw new InvariantError('Failed to add song');
    }
    return id;
  }

  async getSongs({
    title, performer,
  }) {
    let _title = title;
    let _performer = performer;
    if (title === undefined || title == null) {
      _title = '';
    }
    if (performer === undefined || performer == null) {
      _performer = '';
    }
    const query = {
      text: `SELECT id, title, performer FROM songs WHERE title ILIKE '%${_title}%' AND performer ILIKE '%${_performer}%'`,
    };
    const results = await this._pool.query(query);
    return results.rows.map(mapToSong);
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Song not found');
    }
    return result.rows.map(mapToSong)[0];
  }

  async editSongById(
    songId,
    {
      title, year, genre, performer, duration, albumId,
    },
  ) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, songId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Failed to edit Song, Song not found');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Failed to delete Song, Song not found');
    }
  }
}

export default SongService;
