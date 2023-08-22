/* eslint-disable prettier/prettier */
import playlistResponse from '../responses/playlist.js';

export default {
'/playlistAll': {
summary: 'CRUD with Playlists',
description: 'Get all Playlists from the database',
get: {
    tags: ['Playlists'],
    summary: 'Get all Playlists',
    responses: playlistResponse,
},
post: {
    tags: ['Playlists'],
    summary: 'Create a new Playlist',
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Playlist',
        },
        },
    },
    },
    responses: playlistResponse,
},
},
'/playlist/{id}': {
summary: 'Get one Playlist with given id',
description: 'Get one Playlist with given id',
get: {
    tags: ['Playlists'],
    summary: 'Get one Playlist with given id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the album to get',
    },
    ],
    responses: playlistResponse,
},
put: {
    tags: ['Playlists'],
    summary: 'Update a Playlist',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the album to update',
    },
    ],
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Playlist',
        },
        },
    },
    },
    responses: playlistResponse,
},
delete: {
    tags: ['Playlists'],
    summary: 'Deletes a Playlist with an id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the Playlist to delete',
    },
    ],
    responses: playlistResponse,
},
},
};
