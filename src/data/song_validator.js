import ClientError from '../exceptions/client_error.js';
import songSchema from './song_schema.js';

const songPayloadValidator = {
  validateSong: (payload) => {
    const result = songSchema.validate(payload);
    if (result.error) {
      throw new ClientError(result.error.message);
    }
  },
};

export default songPayloadValidator;
