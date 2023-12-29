const AuthenticationHandler = require('../handler/auth_hadler');
const authRoutes = require('../routes/auth_route');

const authPlugin = {
  name: 'authentication',
  version: '1.0.0',
  register: async (
    server,
    {
      authService,
      usersService,
      tokenManager,
      validator,
    },
  ) => {
    const authHandler = new AuthenticationHandler(
      authService,
      usersService,
      tokenManager,
      validator,
    );
    server.route(authRoutes(authHandler));
  },
};

module.exports = authPlugin;
