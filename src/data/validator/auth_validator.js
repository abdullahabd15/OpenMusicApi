const InvariantError = require('../../exceptions/invariant_error');
const { authenticationSchema, refreshTokenSchema } = require('../schema/auth_schema');

const authenticationValidator = {
  validateAuthenticationPayload: (payload) => {
    const result = authenticationSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateRefreshTokenPayload: (payload) => {
    const result = refreshTokenSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = authenticationValidator;
