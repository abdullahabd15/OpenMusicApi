const AlbumLikesHandler = require('../handler/album_likes_handler');
const albumLikesRoutes = require('../routes/album_likes_route');

const albumLikesPlugin = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumService }) => {
    const handler = new AlbumLikesHandler(albumLikesService, albumService);
    server.route(albumLikesRoutes(handler));
  },
};

module.exports = albumLikesPlugin;
