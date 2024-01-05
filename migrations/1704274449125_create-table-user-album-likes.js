const { albumsTable } = require('./1703266302875_create-table-albums');
const { usersTable } = require('./1703575916427_create-table-users');

/* eslint-disable camelcase */
const albumLikesTable = 'user_album_likes';

const up = (pgm) => {
  pgm.createTable(albumLikesTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    albumLikesTable,
    `fk_${albumLikesTable}.user_id_${usersTable}.id`,
    `FOREIGN KEY(user_id) REFERENCES ${usersTable}(id) ON DELETE CASCADE`,
  );

  pgm.addConstraint(
    albumLikesTable,
    `fk_${albumLikesTable}.album_id_${albumsTable}.id`,
    `FOREIGN KEY(album_id) REFERENCES ${albumsTable}(id) ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropTable(albumLikesTable);
};

module.exports = { albumLikesTable, up, down };
