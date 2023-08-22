/* eslint-disable prettier/prettier */
import SongResponse from '../responses/Song.js';

export default {
'/songsAll': {
summary: 'CRUD with Songs',
description: 'Get all Songs from the database',
get: {
    tags: ['Songs'],
    summary: 'Get all Songs',
    responses: SongResponse,
},
post: {
    tags: ['Songs'],
    summary: 'Create a new Songs',
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Song',
        },
        },
    },
    },
    responses: SongResponse,
},
},
'/Song/{id}': {
summary: 'Get one Song with given id',
description: 'Get one Song with given id',
get: {
    tags: ['Songs'],
    summary: 'Get one Song with given id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the Song to get',
    },
    ],
    responses: SongResponse,
},
put: {
    tags: ['Songs'],
    summary: 'Update a Song',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the Song to update',
    },
    ],
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Song',
        },
        },
    },
    },
    responses: SongResponse,
},
delete: {
    tags: ['Songs'],
    summary: 'Deletes a Song with an id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the Song to delete',
    },
    ],
    responses: SongResponse,
},
},
};
