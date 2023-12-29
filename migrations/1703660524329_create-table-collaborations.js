/* eslint-disable camelcase */
const { usersTable } = require('./1703575916427_create-table-users');
const { playlistTable } = require('./1703577464396_create-table-playlists');

const collaborationsTable = 'collaborations';

const up = (pgm) => {
  pgm.createTable(collaborationsTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    collaborationsTable,
    'unique_playlist_id_and_user_id',
    'UNIQUE(playlist_id, user_id)',
  );

  pgm.addConstraint(
    collaborationsTable,
    'fk_collaborations.playlist_id_playlists.id',
    `FOREIGN KEY(playlist_id) REFERENCES ${playlistTable}(id) ON DELETE CASCADE`,
  );

  pgm.addConstraint(
    collaborationsTable,
    'fk_collaborations.user_id_users.id',
    `FOREIGN KEY(user_id) REFERENCES ${usersTable} ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropTable(collaborationsTable);
};

module.exports = { up, down, collaborationsTable };
