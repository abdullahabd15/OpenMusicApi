const {
  postMethod, getMethod, putMethod, deleteMethod,
} = require('../../utils/consts');

const path = '/albums';

const albumRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postAlbumHandler,
  },
  {
    method: getMethod,
    path: `${path}/{id}`,
    handler: handler.getAlbumHandler,
  },
  {
    method: putMethod,
    path: `${path}/{id}`,
    handler: handler.putAlbumHandler,
  },
  {
    method: deleteMethod,
    path: `${path}/{id}`,
    handler: handler.deleteAlbumHandler,
  },
];

module.exports = albumRoutes;
