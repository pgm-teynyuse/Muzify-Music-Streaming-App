/* eslint-disable import/prefer-default-export */
import DataSource from '../lib/DataSource.js';
import jwt from 'jsonwebtoken';

export const reader = async (req, res) => {

    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    
    const songRepository = DataSource.getRepository('Song')
    const songDataAll = await songRepository.find({
      relations: ['artist', 'album'],
    });

    const albumRepository = DataSource.getRepository('Album')
    const albumData = await albumRepository.find({
        relations:['artist']
        });

    const songsAll = songDataAll;
    const albumsAll = albumData;

  res.render('reader', {
    layout: 'reader',
    title: 'Muzify',
    songsAll,
    albumsAll,
  });
};
