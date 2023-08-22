import express from 'express';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import cookieParser from 'cookie-parser';
	
import multer from "multer";
import swaggerUi from 'swagger-ui-express';
import { saveAvatar } from "./middleware/saveAvatar.js";
import { playlistAvatar } from "./middleware/playlistAvatar.js";

import bodyParser from 'body-parser';
import HandlebarsHelpers from './lib/HandlebarsHelpers.js';
import { VIEWS_PATH } from './consts.js';
import DataSource from './lib/DataSource.js';

import { home } from './controllers/home.js';
import swaggerDefinition from './docs/swagger.js';

import { reader } from './controllers/reader.js';
import { discover, addAlbumToFavorites, removeAlbumFromFavorites, addSongToFavorites, removeSongFromFavorites} from './controllers/discover.js';

// Albums
import { albums, albumsAll, detailAlbum, createAlbum, deleteAlbum, updateAlbum, addSong, updateSong, deleteSong } from './controllers/albums.js';

// Playlist
import { playlists, playlistsAll, detailPlaylist, createPlaylist, updatePlaylist, deletePlaylist, removeSongFromPlaylist  } from './controllers/playlist.js';

// Song
import { songsAll, detailSong, addSongToPlaylist, likedSongs  } from './controllers/song.js';

// import users
import {
  getUsers,
  getUser,
  userDetail,
  users,
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
app.use(cookieParser());

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);

// Reader
app.get('/reader', reader); 
app.get('/', jwtAuth, home, removeSongFromFavorites, removeAlbumFromFavorites);
app.get('/reader', reader);

// Client
app.get('/discover', jwtAuth, discover);
app.post('/addtofavorites/:id', jwtAuth, addAlbumToFavorites, addSongToFavorites); 
app.post('/removefromfavorites/:id', jwtAuth, removeAlbumFromFavorites, removeSongFromFavorites); 
app.post('/addSongtofavorites/:id', jwtAuth, addSongToFavorites); 
app.post('/removeSongfromfavorites/:id', jwtAuth,removeSongFromFavorites); 

app.get('/albumsAll', jwtAuth, albumsAll);
app.get('/songsAll', jwtAuth, songsAll);
app.get('/playlistsAll', jwtAuth, playlistsAll);
app.get('/users', jwtAuth, users);

// Playlist
app.get('/playlists', jwtAuth, playlists);
app.get('/playlist/:id', jwtAuth, detailPlaylist, removeSongFromPlaylist);
app.post('/createPlaylist', jwtAuth, createPlaylist);
app.post('/removePlaylist/:id', jwtAuth, deletePlaylist); 
app.post('/updatePlaylist/:id', jwtAuth, updatePlaylist); 

app.post('/removeSong/:id', jwtAuth, removeSongFromPlaylist);

// Artist
app.get('/albums', jwtAuth, albums);
app.get('/album/:id', jwtAuth, detailAlbum);
app.post('/createAlbum', jwtAuth, createAlbum);
app.post('/deleteAlbum/:id', jwtAuth, deleteAlbum);
app.post('/updateAlbum/:id', jwtAuth, updateAlbum);

app.post('/addSong', jwtAuth, addSong);
app.post('/updateSong/:id', jwtAuth, updateSong);
app.post('/deleteSong/:id', jwtAuth, deleteSong);

// Song
app.get('/song/:id', jwtAuth, detailSong);
app.get('/likedSongs', jwtAuth, likedSongs);
app.post('/toPlaylist/:id', jwtAuth, addSongToPlaylist);

// User 
app.get('/artist/:id', jwtAuth, userDetail);

app.post('/uploadAvatar', multer().single('avatar'), saveAvatar, (req, res) => {
  res.redirect('/albums')
});

app.post('/playlistAvatar', multer().single('avatar'), playlistAvatar, (req, res) => {
  res.redirect('/playlists')
});

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
