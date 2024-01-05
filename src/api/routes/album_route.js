const path = require('path');
const {
  postMethod, getMethod, putMethod, deleteMethod,
} = require('../../utils/consts');

const _path = '/albums';

const albumRoutes = (handler) => [
  {
    method: postMethod,
    path: _path,
    handler: handler.postAlbumHandler,
  },
  {
    method: getMethod,
    path: `${_path}/{id}`,
    handler: handler.getAlbumHandler,
  },
  {
    method: putMethod,
    path: `${_path}/{id}`,
    handler: handler.putAlbumHandler,
  },
  {
    method: deleteMethod,
    path: `${_path}/{id}`,
    handler: handler.deleteAlbumHandler,
  },
  {
    method: postMethod,
    path: `${_path}/{albumId}/covers`,
    handler: handler.postAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: getMethod,
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../upload/file'),
      },
    },
  },
];

module.exports = albumRoutes;
