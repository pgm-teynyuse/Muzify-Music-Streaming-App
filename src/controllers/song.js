import DataSource from '../lib/DataSource.js';
import jwt from 'jsonwebtoken';

export const detailSong = async (req, res) => {
    const songId = req.params.id; 
    const userId = req.user.id; 
    
    const songRepository = DataSource.getRepository('Song')
    const songData = await songRepository.findOne({
        where: {
            id: songId,
        },
        relations: ['artist', 'album']
    });

    const playlistRepository = DataSource.getRepository('Playlist');
    const playlists = await playlistRepository.find({
        where: {
            users: { id: userId },
        }
    });

    const songsDetail = songData;
    console.log(playlists);

    const songTitle = songsDetail.name; 
    res.render('song-detail', {
        user: req.user,
        songsDetail,
        playlists,
        title: songTitle, 
    });
}

export const addSongToPlaylist = async (req, res) => {
  try {
    const songId = req.body.songId;
    const userId = req.user.id;
    const playlistId = req.body.playlistId;

    const songRepository = DataSource.getRepository('Song');
    const playlistRepository = DataSource.getRepository('Playlist');
    const userRepository = DataSource.getRepository('User');

    const song = await songRepository.findOne({
      where: {
        id: songId,
      },
      relations: ['playlists'],
    });

    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const playlist = await playlistRepository.findOne({
      where: {
        id: playlistId,
        users: userId,
      },
      relations: ['songs'],
    });

    if (song && user && playlist) {
      // Add the song to the playlist's songs
      playlist.songs.push(song);
      await playlistRepository.save(playlist);
      res.redirect(`/playlist/${playlistId}`);
    } else {
      res.status(400).json({ error: 'Song, user, or playlist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likedSongs = async (req, res) => {
  const userRepository = DataSource.getRepository('User');
  const users = await userRepository.find();
  const userRole = req.user ? req.user.role.label : 'Reader';
  const userId = req.user.id;
  
  const songRepository = DataSource.getRepository('Song');

  try {
  const songData = await songRepository.find({
    where: {
        clients: { id: userId },
    },
    relations:['artist', 'album']
    });
    const songs = songData;


    res.render('likedSongs', {
      user: req.user,
      users,
      songs,
      layout: 'main',
      title: 'Liked Songs',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






