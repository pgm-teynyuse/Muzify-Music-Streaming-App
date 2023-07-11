import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Song',
  tableName: 'Songs',
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
    artist: {
      target: 'User',
      type: 'many-to-one',
    },
    album: {
      target: 'Album',
      type: 'many-to-one',
    },
    clients: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'Song_Clients',
        joinColumn: {
          name: 'song_id',
        },
        inverseJoinColumn: {
          name: 'client_id',
        },
      },
    },
    playlists: {
      type: 'many-to-many',
      target: 'Playlist',
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
  },
});
