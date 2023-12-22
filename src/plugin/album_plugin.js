import AlbumHandler from '../handler/album_handler.js';
import albumRoutes from '../routes/album_route.js';

const albumPlugin = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};

export default albumPlugin;
