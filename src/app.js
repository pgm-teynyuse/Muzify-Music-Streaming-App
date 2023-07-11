import express from 'express';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import HandlebarsHelpers from './lib/HandlebarsHelpers.js';
import { VIEWS_PATH } from './consts.js';
import DataSource from './lib/DataSource.js';

import { home } from './controllers/home.js';
import { reader } from './controllers/reader.js';
import { discover, addAlbumToFavorites, removeAlbumFromFavorites, addSongToFavorites, removeSongFromFavorites } from './controllers/discover.js';

// Artist
import { albums, detailAlbum, createAlbum, deleteAlbum, updateAlbum } from './controllers/albums.js';

// Playlist
import { playlists, detailPlaylist } from './controllers/playlist.js';


// import users
import {
  getUsers,
  getUser
} from './controllers/api/users.js';

// Import authentication
import {
  login,
  register,
  postLogin,
  postRegister,
  logout,
} from './controllers/authentication.js';

// import middleware
import registerAuthentication from './middleware/validation/registerAuthentication.js';
import loginAuthentication from './middleware/validation/loginAuthentication.js';
import { jwtAuth } from './middleware/jwtAuth.js';

dotenv.config();

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const hbs = create({
  helpers: HandlebarsHelpers,
  extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);

// Reader
app.get('/reader', reader); 
app.get('/', jwtAuth, home);
app.get('/reader', reader);

// Client
app.get('/discover', jwtAuth, discover);
app.post('/addtofavorites/:id', jwtAuth, addAlbumToFavorites, addSongToFavorites); 
app.post('/removefromfavorites/:id', jwtAuth, removeAlbumFromFavorites, removeSongFromFavorites); 
app.post('/addSongtofavorites/:id', jwtAuth, addSongToFavorites); 
app.post('/removeSongfromfavorites/:id', jwtAuth,removeSongFromFavorites); 

// Playlist
app.get('/playlists', jwtAuth, playlists);
app.get('/playlist/:id', jwtAuth, detailPlaylist);

// Artist
app.get('/albums', jwtAuth, albums);
app.get('/album/:id', jwtAuth, detailAlbum);
app.post('/createAlbum', jwtAuth, createAlbum);
app.post('/deleteAlbum/:id', jwtAuth, deleteAlbum);
app.post('/updateAlbum/:id', jwtAuth, updateAlbum);

// Login and Register
app.get('/login', login);
app.get('/register', register);
app.get('/logout', logout);

app.post('/register', registerAuthentication, postRegister, register);
app.post('/login', loginAuthentication, postLogin, login);
app.post('/logout', logout);

// Users
app.get('/users', getUsers);
app.get('/users/:id', getUser);

DataSource.initialize()
  .then(() => {
    // start the server
    app.listen(process.env.PORT, () => {
      console.log(
        `Application is running on http://localhost:${process.env.PORT}/.`,
      );
    });
  })
  .catch((error) => {
    console.log('Error: ', error);
  });

export default app;
