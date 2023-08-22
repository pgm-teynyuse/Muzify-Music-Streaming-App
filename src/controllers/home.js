/* eslint-disable import/prefer-default-export */
import DataSource from '../lib/DataSource.js';

export const home = async (req, res) => {
  const userRepository = DataSource.getRepository('User');
  const users = await userRepository.find();
  const userRole = req.user ? req.user.role.label : 'Reader';
  const userId = req.user.id; 

  const albumRepository = DataSource.getRepository('Album')
  const albumData = await albumRepository.find({
    where: {
        clients: { id: userId },
    },
    relations:['artist']
    });
    const albums = albumData;

  const songRepository = DataSource.getRepository('Song')
  const songData = await songRepository.find({
    where: {
        clients: { id: userId },
    },
    relations:['artist', 'album']
    });
    const songs = songData;

  if (req.user) {
    } if (userRole === 'Client') {
      res.render('home', {
        user: req.user,
        albums,
        songs,
        users,
        title: "Home"
      });
    } else if (userRole === 'Artist') {
      res.render('home', {
        user: req.user,
        songs,
        albums,
        users,
        title: "Home"
      });
    }
};

export const removeSongFromFavorites = async (req, res) => {
  try {
    const songId = req.params.id; // ID van het liedje om te verwijderen
    const userId = req.user.id; // ID van de ingelogde gebruiker

    const songRepository = DataSource.getRepository('Song');
    const userRepository = DataSource.getRepository('User');

    const song = await songRepository.findOne({
      where: {
        id: songId
      },
      relations: ['clients'] 
    });

    if (song) {
      const user = await userRepository.findOne({
        where: {
          id: userId
        }
      });

      if (user) {
        song.clients = song.clients.filter(client => client.id !== userId);
        await songRepository.save(song);
        res.redirect('/');
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

export const removeAlbumFromFavorites = async (req, res) => {
  try {
    const albumId = req.params.id; // ID van het album om te verwijderen
    const userId = req.user.id; // ID van de ingelogde gebruiker

    const albumRepository = DataSource.getRepository('Album');
    const userRepository = DataSource.getRepository('User');

    const album = await albumRepository.findOne({
        where:{
            id:albumId
        }, 
        relations: ['clients'] 
    });

    if (album) {

      const user = await userRepository.findOne({
        where:{
            id:userId
        },
    });
      if (user) {
        album.clients = album.clients.filter(client => client.id !== user.id); 
        await albumRepository.save(album);
        res.redirect('/');
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Album not found' });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};
