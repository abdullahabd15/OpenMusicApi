const InvariantError = require('../../exceptions/invariant_error');
const { usersSchema } = require('../schema/users_schema');

const usersValidator = {
  validateUsersPayload: (payload) => {
    const result = usersSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = usersValidator;
