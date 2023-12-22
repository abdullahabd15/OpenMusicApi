/* eslint-disable camelcase */
import parseNumber from './parser.js';

const mapToAlbum = ({
  id,
  name,
  year,
  song_id,
  title,
  performer,
}) => ({
  id,
  name,
  year: parseNumber(year),
  song_id,
  title,
  performer,
});

const mapToSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year: parseNumber(year),
  performer,
  genre,
  duration: parseNumber(duration),
  albumId: album_id,
});

export default { mapToAlbum, mapToSong };
