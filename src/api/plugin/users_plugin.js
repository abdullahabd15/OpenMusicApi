const UsersHandler = require('../handler/users_handler');
const usersRoutes = require('../routes/users_route');

const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService, validator }) => {
    const usersHandler = new UsersHandler(usersService, validator);
    server.route(usersRoutes(usersHandler));
  },
};

module.exports = usersPlugin;
