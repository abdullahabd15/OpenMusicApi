import ClientError from '../exceptions/client_error.js';
import albumSchema from './album_schema.js';

const albumPayloadValidator = {
  validateAlbum: (payload) => {
    const result = albumSchema.validate(payload);
    if (result.error) {
      throw new ClientError(result.error.message);
    }
  },
};

export default albumPayloadValidator;
