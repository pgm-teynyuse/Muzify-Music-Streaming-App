/* eslint-disable prettier/prettier */
import feedbackResponse from '../responses/feedbacks.js';

export default {
'/feedbacks': {
summary: 'CRUD with feedbacks',
description: 'Get all feedbacks from the database',
get: {
    tags: ['Feedbacks'],
    summary: 'Get all feedbacks',
    responses: feedbackResponse,
},
post: {
    tags: ['Feedbacks'],
    summary: 'Create a new feedback',
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Feedback',
        },
        },
    },
    },
    responses: feedbackResponse,
},
},
'/feedbacks/{id}': {
summary: 'Get one feedback with given id',
description: 'Get one feedback with given id',
get: {
    tags: ['Feedbacks'],
    summary: 'Get one feedback with given id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the feedback to get',
    },
    ],
    responses: feedbackResponse,
},
put: {
    tags: ['Feedbacks'],
    summary: 'Update a feedback',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the feedback to update',
    },
    ],
    requestBody: {
    required: true,
    content: {
        'application/json': {
        schema: {
            $ref: '#/components/schemas/Feedback',
        },
        },
    },
    },
    responses: feedbackResponse,
},
delete: {
    tags: ['Feedbacks'],
    summary: 'Deletes a feedback with an id',
    parameters: [
    {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
        type: 'integer',
        minimum: 1,
        },
        description: 'ID of the feedback to delete',
    },
    ],
    responses: feedbackResponse,
},
},
};
