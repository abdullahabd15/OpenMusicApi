/* eslint-disable camelcase */
const parseNumber = require('./parser');

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

module.exports = { mapToAlbum, mapToSong };
