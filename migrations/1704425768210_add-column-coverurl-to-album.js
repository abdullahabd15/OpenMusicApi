const { albumsTable } = require('./1703266302875_create-table-albums');

const up = (pgm) => {
  pgm.addColumns(
    albumsTable,
    {
      coverUrl: {
        type: 'TEXT',
      },
    },
  );
};

const down = (pgm) => {
  pgm.dropColumns(
    albumsTable,
    ['coverUrl'],
  );
};

module.exports = { up, down };
