const exportSchema = require('../schema/export_schema');
const InvariantError = require('../../exceptions/invariant_error');

const exportValidator = {
  validateExportSongsPayload: (payload) => {
    const result = exportSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = exportValidator;
