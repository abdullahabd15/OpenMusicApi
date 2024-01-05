const authTable = 'authentications';

const up = (pgm) => {
  pgm.createTable(authTable, {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable(authTable);
};

module.exports = { up, down, authTable };
