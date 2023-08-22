import DataSource from '../lib/DataSource.js';
import jwt from 'jsonwebtoken';

export const albums = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const userId = req.user.id; 
    
    const albumRepository = DataSource.getRepository('Album')
    const albumData = await albumRepository.find({
        where: {
            artist: { id: userId },
        },
        relations:['artist']
        });

    const albumsArtist = albumData;
    console.log(albumsArtist)
    res.render('albums', {
    user: req.user,
    albumsArtist,
    users,
    title: "My Albums"
    });
}

export const albumsAll = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const userId = req.user.id; 
    
    const albumRepository = DataSource.getRepository('Album')
    const albumData = await albumRepository.find({
        relations:['artist']
        });

    const albumsAll = albumData;
    res.render('allAlbums', {
    user: req.user,
    albumsAll,
    users,
    title: "My Albums"
    });
}

export const detailAlbum = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const albumId = req.params.id; 
    
    const albumRepository = DataSource.getRepository('Album')
    const albumData = await albumRepository.findOne({
        where: {
            id: albumId,
        },
        relations: ['artist', 'songs', 'songs.artist', 'songs.album']
    });

    if (albumData) {
        const albumsDetail = albumData;
        const albumTitle = albumsDetail.name; 
        console.log(albumsDetail.artist);
        
        res.render('album-detail', {
            user: req.user,
            albumsDetail,
            users,
            title: albumTitle 
        });
    } else {
        res.status(404).send('Album not found');
    }
}

export const createAlbum = async (req, res, next) => {
try {
    const { token } = req.cookies;
    const tokenDeco = jwt.decode(token);

    if (!req.body.name)
    throw new Error('Please provide a name for the album.');
    if (!req.body.genre)
    throw new Error('Please provide a genre for the album.');
    if (!req.body.artist)
    throw new Error('Please provide an artist for the album.');

    const albumRepository = DataSource.getRepository('Album');

    const artistId = req.user.id;

    const album = await albumRepository.findOne({
    where: {
        name: req.body.name,
        artist: artistId,
        genre: req.body.genre
    },
    });

    if (album) {
    res
        .status(200)
        .send({ status: `Album with name ${album.name} already exists.` });
    return;
    }

    req.body.artist = artistId;

    console.log('Album Request: ', req.body);

    const createdAlbum = await albumRepository.create(req.body);
    const savedAlbum = await albumRepository.save(createdAlbum);

    res
    .status(200)
    .redirect('/albums')
    .send({ status: `Created album with id ${savedAlbum.id}.` });
} catch (error) {
next(error.message);
}
};

export const deleteAlbum = async (req, res, next) => {
  console.log('Deleting album');
  try {
    const albumId = req.params.id;

    const albumRepository = DataSource.getRepository('Album');

    const artistId = req.user.id;

    const album = await albumRepository.findOne({
      where: {
        id: albumId,
        artist: artistId,
      },
    });

    if (!album) {
      res.status(404).send({ error: 'Album not found.' });
      return;
    }

    await albumRepository.delete(albumId);
    res.redirect('/albums');
    res.locals.alertMessage = 'Album successfully deleted!';
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  console.log('Updating album');
  try {
    const albumId = req.params.id;
    const updatedName = req.body.name;
    const updatedGenre = req.body.genre;

    if (!updatedName) {
      throw new Error('Please provide a name for the updated album.');
    }
    if (!updatedGenre) {
      throw new Error('Please provide a genre for the updated album.');
    }

    const albumRepository = DataSource.getRepository('Album');

    const artistId = req.user.id;

    const album = await albumRepository.findOne({
      where: {
        id: albumId,
        artist: artistId,
      },
    });

    if (!album) {
      res.status(404).send({ error: 'Album not found.' });
      return;
    }

    album.name = updatedName;
    album.genre = updatedGenre;

    const updatedAlbum = await albumRepository.save(album);
    res.redirect('/albums');
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};

export const addSong = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const tokenDeco = jwt.decode(token);

    if (!req.body.name) {
      throw new Error('Please provide a name for the song.');
    }
    if (!req.body.artist) {
      throw new Error('Please provide an artist for the song.');
    }

    const songRepository = DataSource.getRepository('Song');
    const albumRepository = DataSource.getRepository('Album');
    const userRepository = DataSource.getRepository('User'); 
    const user = await userRepository.find();

    const artistId = req.user.id;
    const albumId = req.params.id;
    console.log('Received albumId:', albumId);

    // Fetch the album and check if the logged-in user (artist) is the owner
    const album = await albumRepository.findOne({
      where: {
        id: albumId,
        artist: artistId,
      },
      relations:['artist']
    });

    if (!album) {
      res.status(403).send({ status: 'You do not have permission to add a song to this album.' });
      return;
    }

    // Fetch the user's information
    const artist = await userRepository.find({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      res.status(404).send({ status: 'Artist not found.' });
      return;
    }

    const song = await songRepository.findOne({
      where: {
        name: req.body.name,
        artist: artistId,
        album: albumId,
      },
      relations: ['album'],
    });

    if (song) {
      res.status(200).send({ status: `Song with name ${song.name} already exists.` });
      return;
    }

    req.body.artist = artistId;

    console.log('Song Request: ', req.body);

    const createdSong = await songRepository.create(req.body);
    const savedSong = await songRepository.save(createdSong);

    console.log('Redirecting to albumId:', album.id);
    res.status(200).redirect(`/album/${album.id}`);
  } catch (error) {
    next(error.message);
  }
};

export const deleteSong = async (req, res, next) => {
  console.log('Deleting song');
  try {
    const songId = req.params.id;

    const songRepository = DataSource.getRepository('Song');
    const albumRepository = DataSource.getRepository('Album');
    const userRepository = DataSource.getRepository('User'); // Add this line

    const artistId = req.user.id;

    const song = await songRepository.findOne({
      where: {
        id: songId,
        artist: artistId,
      },
      relations: ['album'],
    });

    if (!song) {
      res.status(404).send({ error: 'Song not found.' });
      return;
    }

    const albumId = song.album.id;


    const album = await albumRepository.findOne({
      where: {
        id: albumId,
        artist: {id:artistId},
      },
    });

    if (!album) {
      res.status(403).send({ error: 'You do not have permission to delete this song.' });
      return;
    }

    // Fetch the user's information
    const artist = await userRepository.findOne({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      res.status(404).send({ error: 'Artist not found.' });
      return;
    }

    await songRepository.delete(songId);
    res.redirect(`/album/${albumId}`);
    res.locals.alertMessage = 'Song successfully deleted!';
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  console.log('Updating song');
  try {
    const songId = req.params.id;
    const updatedName = req.body.name;

    if (!updatedName) {
      throw new Error('Please provide a name for the updated song.');
    }

    const songRepository = DataSource.getRepository('Song');

    const artistId = req.user.id;

    const song = await songRepository.findOne({
      where: {
        id: songId,
        artist: artistId,
      },
      relations:['album']
    });

    if (!song) {
      res.status(404).send({ error: 'Song not found.' });
      return;
    }

    song.name = updatedName;
    const albumId = song.album.id;

    const updatedSong = await songRepository.save(song);
    res.redirect(`/album/${albumId}`);
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};






