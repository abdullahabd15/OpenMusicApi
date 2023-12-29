const InvariantError = require('../../exceptions/invariant_error');
const { collaborationSchema } = require('../schema/collaboration_schema');

const collaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const result = collaborationSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = collaborationValidator;
