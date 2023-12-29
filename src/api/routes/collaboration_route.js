const { postMethod, deleteMethod, openmusicJwtName } = require('../../utils/consts');

const path = '/collaborations';

const collaborationRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postCollaborationHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: deleteMethod,
    path,
    handler: handler.deleteCollaboration,
    options: {
      auth: openmusicJwtName,
    },
  },
];

module.exports = collaborationRoutes;
