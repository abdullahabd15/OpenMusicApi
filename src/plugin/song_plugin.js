import SongHandler from '../handler/song_handler.js';
import songRoute from '../routes/song_route.js';

const songPlugin = {
  name: 'song',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(songRoute(songHandler));
  },
};

export default songPlugin;
