require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const AlbumService = require('./services/album_service');
const SongService = require('./services/song_service');
const AuthService = require('./services/auth_service');
const CollaborationService = require('./services/collaborations_service');
const PlaylistActivitiesService = require('./services/playlist_activity_service');
const PlaylistService = require('./services/playlist_service');
const PlaylistSongsService = require('./services/playlist_songs_service');
const UsersService = require('./services/users_service');

const ClientError = require('./exceptions/client_error');

const albumPayloadValidator = require('./data/validator/album_validator');
const songPayloadValidator = require('./data/validator/song_validator');
const authenticationValidator = require('./data/validator/auth_validator');
const collaborationValidator = require('./data/validator/collaboration_validator');
const playlistsValidator = require('./data/validator/playlists_validator');
const usersValidator = require('./data/validator/users_validator');

const albumPlugin = require('./api/plugin/album_plugin');
const songPlugin = require('./api/plugin/song_plugin');
const authPlugin = require('./api/plugin/auth_plugin');
const collaborationPlugin = require('./api/plugin/collaboration_plugin');
const playlistPlugin = require('./api/plugin/playlist_plugin');
const usersPlugin = require('./api/plugin/users_plugin');

const {
  serverErrorCode, failStatus, errorStatus, openmusicJwtName,
} = require('./utils/consts');
const { tokenManager } = require('./utils/token_manager');

const hapiServer = () => Hapi.Server({
  port: process.env.PORT,
  host: process.env.HOST,
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

const initJwt = async (server) => {
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
  server.auth.strategy(openmusicJwtName, 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
};

const initOnPreResponseInterceptor = (server) => {
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: failStatus,
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: errorStatus,
        message: 'Internal server error',
      });
      newResponse.code(serverErrorCode);
      return newResponse;
    }

    return h.continue;
  });
};

const registerPlugin = async (
  server,
  albumService,
  songService,
  authService,
  collaborationService,
  playlistActivitiesService,
  playlistService,
  playlistSongsService,
  usersService,
) => {
  await server.register([
    {
      plugin: albumPlugin,
      options: {
        service: albumService,
        validator: albumPayloadValidator,
      },
    },
    {
      plugin: songPlugin,
      options: {
        service: songService,
        validator: songPayloadValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        authService,
        usersService,
        tokenManager,
        validator: authenticationValidator,
      },
    },
    {
      plugin: collaborationPlugin,
      options: {
        collaborationService,
        playlistService,
        usersService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: playlistPlugin,
      options: {
        playlistService,
        playlistSongsService,
        playlistActivitiesService,
        collaborationService,
        songService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        usersService, validator: usersValidator,
      },
    },
  ]);
};

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const authService = new AuthService();
  const collaborationService = new CollaborationService();
  const playlistActivitiesService = new PlaylistActivitiesService();
  const playlistService = new PlaylistService();
  const playlistSongsService = new PlaylistSongsService();
  const usersService = new UsersService();

  const server = hapiServer();

  await initJwt(server);
  initOnPreResponseInterceptor(server);
  await registerPlugin(
    server,
    albumService,
    songService,
    authService,
    collaborationService,
    playlistActivitiesService,
    playlistService,
    playlistSongsService,
    usersService,
  );

  await server.start();
};

init();
