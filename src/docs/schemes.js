/* eslint-disable prettier/prettier */
export default { 
    User: {
    properties: {
        id: { type: "number" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        role: {
        $ref: "#/components/schemas/Role",
        },
        email: { type: "string" },
        userName: { type: "string" },
        password: { type: "string" },
    },
    example: {
        firstName: "John",
        lastName: "Doe",
        user_meta: {
        address: "123 Main St",
        zipCode: "12345",
        city: "New York",
        },
        role: {
        name: "admin",
        },
        email: "john.doe@example.com",
        userName: "johndoe",
        password: "password123",
    },
    },
    Album: {
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        genre: { type: "string" },
        artist: {
        $ref: "#/components/schemas/User",
        },
        songs: {
        $ref: "#/components/schemas/Song",
        },
        clients: {
        $ref: "#/components/schemas/User",
        },
    },
    example: {
        id: 1,
        name: "Playlist",
        artist: {},
        songs: {},
        clients: {},
    },
    },
    Playlist: {
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        users: {
        $ref: "#/components/schemas/User",
        },
        songs: {
        $ref: "#/components/schemas/Song",
        },
    },
    example: {
        id: 1,
        name: "Playlist",
        users: {},
        songs: {},
    },
    },
    Playlist: {
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        artist: {
        $ref: "#/components/schemas/User",
        },
        songs: {
        $ref: "#/components/schemas/Song",
        },
        album: {
        $ref: "#/components/schemas/Album",
        },
        playlists: {
        $ref: "#/components/schemas/Playlist",
        },
        clients: {
        $ref: "#/components/schemas/User",
        },
    },
    example: {
        id: 1,
        name: "Song",
        artist: {},
        album: {},
        clients: {},
        playlists: {},
    },
    },
};
