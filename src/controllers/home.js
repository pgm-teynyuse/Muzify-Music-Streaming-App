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
    });
    const songs = songData;

  if (req.user) {
    if (userRole === 'Admin') {
      res.render('admin', {
        user: req.user,
        users,
        title: "Home"
      });
    } else if (userRole === 'Client') {
      res.render('home', {
        user: req.user,
        albums,
        songs,
        users,
        title: "Home"
      });
    } else if (userRole === 'Artist') {
      res.render('artist', {
        user: req.user,
        songs,
        albums,
        users,
        title: "Home"
      });
    }
  }
};
