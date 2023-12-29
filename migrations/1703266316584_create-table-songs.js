/* eslint-disable camelcase */
const songsTable = 'songs';

const up = (pgm) => {
  pgm.createTable(songsTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable(songsTable);
};

module.exports = { up, down, songsTable };
