/* eslint-disable prettier/prettier */
import albumResponse from '../responses/album.js';

export default {
'/albumsAll': {
summary: 'CRUD with albums',
description: 'Get all albums from the database',
get: {
    tags: ['Albums'],
    summary: 'Get all albums',
    responses: albumResponse,
},
post: {
    tags: ['Albums'],
    summary: 'Create a new album',
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Album',
        },
        },
    },
    },
    responses: albumResponse,
},
},
'/album/{id}': {
summary: 'Get one album with given id',
description: 'Get one album with given id',
get: {
    tags: ['Albums'],
    summary: 'Get one album with given id',
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
    responses: albumResponse,
},
put: {
    tags: ['Albums'],
    summary: 'Update a album',
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
            $ref: '#/components/schemas/Album',
        },
        },
    },
    },
    responses: albumResponse,
},
delete: {
    tags: ['Albums'],
    summary: 'Deletes a albums with an id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the album to delete',
    },
    ],
    responses: albumResponse,
},
},
};
