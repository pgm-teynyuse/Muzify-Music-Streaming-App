import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Album',
  tableName: 'Albums',
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
      joinColumn: {
        name: 'artist_id',
      },
    },
    songs: {
      type: 'one-to-many',
      target: 'Song',
      inverseSide: 'album',
    },
  clients: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'Album_Clients',
        joinColumn: {
          name: 'album_id',
        },
        inverseJoinColumn: {
          name: 'client_id',
        },
      },
    },
  },
});
