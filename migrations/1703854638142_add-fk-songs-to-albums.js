const { albumsTable } = require('./1703266302875_create-table-albums');
const { songsTable } = require('./1703266316584_create-table-songs');

const up = (pgm) => {
  pgm.addConstraint(
    songsTable,
    'fk_songs.album_id_albums.id',
    `FOREIGN KEY(album_id) REFERENCES ${albumsTable}(id) ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropConstraint(songsTable, 'fk_songs.album_id_albums.id');
};

module.exports = { up, down };
