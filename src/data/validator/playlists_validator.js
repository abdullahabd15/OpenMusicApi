const InvariantError = require('../../exceptions/invariant_error');
const { playlistsSchema, songPlaylistSchema } = require('../schema/playlists_schema');

const playlistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const result = playlistsSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateSongPlaylistPayload: (payload) => {
    const result = songPlaylistSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = playlistsValidator;
