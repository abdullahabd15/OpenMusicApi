const AlbumHandler = require('../handler/album_handler');
const albumRoutes = require('../routes/album_route');

const albumPlugin = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};

module.exports = albumPlugin;
