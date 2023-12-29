const CollaborationHandler = require('../handler/collaboration_handler');
const collaborationRoutes = require('../routes/collaboration_route');

const collaborationPlugin = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (
    server,
    {
      collaborationService,
      playlistService,
      usersService,
      validator,
    },
  ) => {
    const collabHandler = new CollaborationHandler(
      collaborationService,
      playlistService,
      usersService,
      validator,
    );
    server.route(collaborationRoutes(collabHandler));
  },
};

module.exports = collaborationPlugin;
