const { postMethod } = require('../../utils/consts');

const path = '/users';

const usersRoutes = (handler) => [
  {
    method: postMethod,
    path,
    handler: handler.postUserHandler,
  },
];

module.exports = usersRoutes;
