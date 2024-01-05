const InvariantError = require('../../exceptions/invariant_error');
const { albumSchema, albumCoverSchema } = require('../schema/album_schema');

const albumPayloadValidator = {
  validateAlbum: (payload) => {
    const result = albumSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateAlbumCover: (payload) => {
    const result = albumCoverSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = albumPayloadValidator;
