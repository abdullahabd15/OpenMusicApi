const {
  postMethod,
  openmusicJwtName,
  getMethod,
  deleteMethod,
} = require('../../utils/consts');

const path = '/albums/{id}/likes';

const albumLikesRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postLikeAlbumHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: deleteMethod,
    path,
    handler: handler.postUnlikeAlbumHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: getMethod,
    path,
    handler: handler.getAlbumLikesHandler,
  },
];

module.exports = albumLikesRoutes;
