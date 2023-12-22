require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/album_service');
const SongService = require('./services/song_service');
const ClientError = require('./exceptions/client_error');
const albumPayloadValidator = require('./data/album_validator');
const songPayloadValidator = require('./data/song_validator');
const albumPlugin = require('./plugin/album_plugin');
const songPlugin = require('./plugin/song_plugin');

const { serverErrorCode, failStatus, errorStatus } = require('./utils/consts');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

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
  ]);

  await server.start();
};

init();
