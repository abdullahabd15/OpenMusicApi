const InvariantError = require('../../exceptions/invariant_error');
const { songSchema } = require('../schema/song_schema');

const songPayloadValidator = {
  validateSong: (payload) => {
    const result = songSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = songPayloadValidator;
