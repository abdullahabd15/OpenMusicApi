require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const AlbumService = require('./services/postgres/album_service');
const SongService = require('./services/postgres/song_service');
const AuthService = require('./services/postgres/auth_service');
const CollaborationService = require('./services/postgres/collaborations_service');
const PlaylistActivitiesService = require('./services/postgres/playlist_activity_service');
const PlaylistService = require('./services/postgres/playlist_service');
const PlaylistSongsService = require('./services/postgres/playlist_songs_service');
const UsersService = require('./services/postgres/users_service');
const StorageService = require('./services/storage/storage_service');
const AlbumLikesService = require('./services/postgres/album_likes_service');
const CacheService = require('./services/redis/cache_service');
const ProducerService = require('./services/rabbitmq/producer_service');

const ClientError = require('./exceptions/client_error');

const albumPayloadValidator = require('./data/validator/album_validator');
const songPayloadValidator = require('./data/validator/song_validator');
const authenticationValidator = require('./data/validator/auth_validator');
const collaborationValidator = require('./data/validator/collaboration_validator');
const playlistsValidator = require('./data/validator/playlists_validator');
const usersValidator = require('./data/validator/users_validator');
const exportValidator = require('./data/validator/export_validator');

const albumPlugin = require('./api/plugin/album_plugin');
const songPlugin = require('./api/plugin/song_plugin');
const authPlugin = require('./api/plugin/auth_plugin');
const collaborationPlugin = require('./api/plugin/collaboration_plugin');
const playlistPlugin = require('./api/plugin/playlist_plugin');
const usersPlugin = require('./api/plugin/users_plugin');
const albumLikesPlugin = require('./api/plugin/album_likes_plugin');
const exportPlugin = require('./api/plugin/export_plugin');

const {
  serverErrorCode, failStatus, errorStatus, openmusicJwtName,
} = require('./utils/consts');
const { tokenManager } = require('./utils/token_manager');
const config = require('./utils/config');

const hapiServer = () => Hapi.Server({
  port: config.app.port,
  host: config.app.host,
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

const registerExternalPlugin = async (server) => {
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
};

const initJwt = (server) => {
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
  albumLikesService,
  storageService,
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
        storageService,
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
    {
      plugin: albumLikesPlugin,
      options: {
        albumLikesService, albumService,
      },
    },
    {
      plugin: exportPlugin,
      options: {
        producerService: ProducerService,
        playlistService,
        collaborationService,
        validator: exportValidator,
      },
    },
  ]);
};

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const albumLikesService = new AlbumLikesService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'upload/file/images'));
  const songService = new SongService();
  const authService = new AuthService();
  const collaborationService = new CollaborationService();
  const playlistActivitiesService = new PlaylistActivitiesService();
  const playlistService = new PlaylistService();
  const playlistSongsService = new PlaylistSongsService();
  const usersService = new UsersService();

  const server = hapiServer();

  await registerExternalPlugin(server);
  initJwt(server);
  initOnPreResponseInterceptor(server);
  await registerPlugin(
    server,
    albumService,
    albumLikesService,
    storageService,
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
