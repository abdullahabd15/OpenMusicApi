const { postMethod, openmusicJwtName } = require('../../utils/consts');

const path = '/export/playlists';

const exportRoutes = (handler) => [
  {
    method: postMethod,
    path: `${path}/{playlistId}`,
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
];

module.exports = { exportRoutes };
