const PlaylistHandler = require('../handler/playlist_handler');
const playlistRoutes = require('../routes/playlist_route');

const playlistPlugin = {
  name: 'playlist',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistService,
      playlistSongsService,
      playlistActivitiesService,
      collaborationService,
      songService,
      validator,
    },
  ) => {
    const playlistsHandler = new PlaylistHandler(
      playlistService,
      playlistSongsService,
      playlistActivitiesService,
      collaborationService,
      songService,
      validator,
    );
    server.route(playlistRoutes(playlistsHandler));
  },
};

module.exports = playlistPlugin;
