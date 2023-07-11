import typeorm from 'typeorm';

const { EntitySchema } = typeorm;

export default new EntitySchema({
  name: 'Playlist',
  tableName: 'Playlists',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
  },

  relations: {
  users: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
          name: 'user_id',
        },
      },
    songs: {
      target: 'Song',
      type: 'many-to-many',
      joinTable: {
        name: 'song_playlist',
        joinColumn: {
          name: 'song_id',
        },
        inverseJoinColumn: {
          name: 'playlist_id',
        },
      },
    },
    songs: {
      type: 'many-to-many',
      target: 'Song',
      joinTable: {
        name: 'song_playlist',
        joinColumn: {
          name: 'playlist_id',
        },
        inverseJoinColumn: {
          name: 'song_id',
        },
      },
    },
  },
});
