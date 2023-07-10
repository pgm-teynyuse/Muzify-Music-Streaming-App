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
    playlists: {
      target: 'Playlist',
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
  },
});
