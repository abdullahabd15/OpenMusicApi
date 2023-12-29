const { usersTable } = require('./1703575916427_create-table-users');

const playlistTable = 'playlists';

const up = (pgm) => {
  pgm.createTable(playlistTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    playlistTable,
    'fk_playlists.owner_users.id',
    `FOREIGN KEY(owner) REFERENCES ${usersTable}(id) ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropTable(playlistTable);
};

module.exports = { up, down, playlistTable };
