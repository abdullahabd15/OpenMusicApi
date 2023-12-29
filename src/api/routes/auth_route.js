const { postMethod, putMethod, deleteMethod } = require('../../utils/consts');

const path = '/authentications';

const authRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postAuthenticationHandler,
  },
  {
    method: putMethod,
    path,
    handler: handler.putAuthenticationHandler,
  },
  {
    method: deleteMethod,
    path,
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = authRoutes;
