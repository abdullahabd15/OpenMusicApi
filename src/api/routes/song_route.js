const {
  postMethod, getMethod, putMethod, deleteMethod,
} = require('../../utils/consts');

const path = '/songs';

const songRoute = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postSongHandler,
  },
  {
    method: getMethod,
    path,
    handler: handler.getSongsHandler,
  },
  {
    method: getMethod,
    path: `${path}/{id}`,
    handler: handler.getSongHandler,
  },
  {
    method: putMethod,
    path: `${path}/{id}`,
    handler: handler.putSongHandler,
  },
  {
    method: deleteMethod,
    path: `${path}/{id}`,
    handler: handler.deleteSongHandler,
  },
];

module.exports = songRoute;
