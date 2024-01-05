const ExportHandler = require('../handler/export_handler');
const { exportRoutes } = require('../routes/export_route');

const exportPlugin = {
  name: 'export',
  version: '1.0.0',
  register: async (server, {
    producerService,
    playlistService,
    collaborationService,
    validator,
  }) => {
    const handler = new ExportHandler(
      producerService,
      playlistService,
      collaborationService,
      validator,
    );
    server.route(exportRoutes(handler));
  },
};

module.exports = exportPlugin;
