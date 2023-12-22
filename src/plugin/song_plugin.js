const SongHandler = require('../handler/song_handler');
const songRoute = require('../routes/song_route');

const songPlugin = {
  name: 'song',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(songRoute(songHandler));
  },
};

module.exports = songPlugin;
