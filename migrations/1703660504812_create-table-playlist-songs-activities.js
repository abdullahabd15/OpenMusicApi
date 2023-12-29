/* eslint-disable camelcase */
const { playlistTable } = require('./1703577464396_create-table-playlists');

const playlistSongsActivitiesTable = 'playlist_songs_activities';

const up = (pgm) => {
  pgm.createTable(playlistSongsActivitiesTable, {
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
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });

  pgm.addConstraint(
    playlistSongsActivitiesTable,
    'fk_playlist_songs_activities.playlist_id_playlists.id',
    `FOREIGN KEY(playlist_id) REFERENCES ${playlistTable}(id) ON DELETE CASCADE`,
  );
};

const down = (pgm) => {
  pgm.dropTable(playlistSongsActivitiesTable);
};

module.exports = { up, down, playlistSongsActivitiesTable };
