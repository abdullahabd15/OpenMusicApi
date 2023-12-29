const {
  postMethod, getMethod, deleteMethod, openmusicJwtName,
} = require('../../utils/consts');

const path = '/playlists';

const playlistRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postPlaylistHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: getMethod,
    path,
    handler: handler.getPlaylistsHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: deleteMethod,
    path: `${path}/{id}`,
    handler: handler.deletePlaylistsByIdHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: postMethod,
    path: `${path}/{id}/songs`,
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: getMethod,
    path: `${path}/{id}/songs`,
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: deleteMethod,
    path: `${path}/{id}/songs`,
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
  {
    method: getMethod,
    path: `${path}/{id}/activities`,
    handler: handler.getPlaylistActivityHandler,
    options: {
      auth: openmusicJwtName,
    },
  },
];

module.exports = playlistRoutes;
