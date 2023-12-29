const albumsTable = 'albums';

const up = (pgm) => {
  pgm.createTable(albumsTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable(albumsTable);
};

module.exports = { up, down, albumsTable };
