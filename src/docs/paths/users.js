/* eslint-disable prettier/prettier */
import userResponse from '../responses/users.js';

export default {
  '/users': {
    summary: 'CRUD with users',
    description: 'Get all users in the database',
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      responses: userResponse,
    },
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            scheme: {
              $ref: '#/components/schemes/User',
            },
          },
        },
      },
      responses: userResponse,
    },
    put: {
      tags: ['Users'],
      summary: 'Update a user',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
          },
          description: 'ID of the user to update',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            scheme: {
              $ref: '#/components/schemes/User',
            },
          },
        },
      },
      responses: userResponse,
    },
  },
  '/user/{id}': {
    summary: 'Get one user with given id',
    description: 'Get one user with given id',
    get: {
      tags: ['Users'],
      summary: 'Get one user with given id',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
          },
          description: 'ID of the user to get',
        },
      ],
      responses: userResponse,
    },
    delete: {
      tags: ['Users'],
      summary: 'Deletes a user with an id',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
          },
          description: 'ID of the user to delete',
        },
      ],
      responses: userResponse,
    },
  },
};
