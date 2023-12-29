const usersTable = 'users';

const up = (pgm) => {
  pgm.createTable(usersTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable(usersTable);
};

module.exports = { up, down, usersTable };
