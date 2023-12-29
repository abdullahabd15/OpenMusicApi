/* eslint-disable camelcase */
const { songsTable } = require('./1703266316584_create-table-songs');
const { playlistTable } = require('./1703577464396_create-table-playlists');

const playlistSongsTable = 'playlist_songs';

const up = (pgm) => {
  pgm.createTable(playlistSongsTable, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    playlistSongsTable,
    'unique_playlist_id_and_song_id',
    'UNIQUE(playlist_id, song_id)',
  );

  pgm.addConstraint(
    playlistSongsTable,
    'fk_playlist_songs.playlist_id_playlists.id',
    `FOREIGN KEY(playlist_id) REFERENCES ${playlistTable}(id) ON DELETE CASCADE`,
  );

  pgm.addConstraint(
    playlistSongsTable,
    'fk_playlist_songs.song_id_songs.id',
    `FOREIGN KEY(song_id) REFERENCES ${songsTable}(id) ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropTable(playlistSongsTable);
};

module.exports = { up, down, playlistSongsTable };
