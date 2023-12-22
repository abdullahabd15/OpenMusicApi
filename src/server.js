import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import AlbumService from './services/album_service.js';
import SongService from './services/song_service.js';
import ClientError from './exceptions/client_error.js';
import albumPayloadValidator from './data/album_validator.js';
import songPayloadValidator from './data/song_validator.js';
import albumPlugin from './plugin/album_plugin.js';
import songPlugin from './plugin/song_plugin.js';
import consts from './utils/consts.js';

const { serverErrorCode, failStatus, errorStatus } = consts;

dotenv.config();

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
