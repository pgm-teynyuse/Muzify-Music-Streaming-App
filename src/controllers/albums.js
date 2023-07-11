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
        });

    const albumsArtist = albumData;
    console.log(albumsArtist)
    res.render('albums', {
    user: req.user,
    albumsArtist,
    users,
    });
}

export const detailAlbum = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const albumId = req.params.id; 
    
    const albumRepository = DataSource.getRepository('Album')
    const albumData = await albumRepository.findOne({
        where: {
            id:albumId,
        },
        relations: ['artist','songs']
        });

    const albumsDetail = albumData;
    console.log(albumsDetail)
    res.render('album-detail', {
    user: req.user,
    albumsDetail,
    users,
    });
}

export const createAlbum = async (req, res, next) => {
try {
    const { token } = req.cookies;
    const tokenDeco = jwt.decode(token);

    if (!req.body.name)
    throw new Error('Please provide a name for the album.');
    if (!req.body.artist)
    throw new Error('Please provide an artist for the album.');

    const albumRepository = DataSource.getRepository('Album');

    const artistId = req.user.id;

    const album = await albumRepository.findOne({
    where: {
        name: req.body.name,
        artist: artistId,
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

    if (!updatedName) {
      throw new Error('Please provide a name for the updated album.');
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

    const updatedAlbum = await albumRepository.save(album);
    res.redirect('/albums');
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};




