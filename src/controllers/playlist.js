import DataSource from '../lib/DataSource.js';
import jwt from 'jsonwebtoken';

export const playlists = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const userId = req.user.id; 

    const playlistRepository = DataSource.getRepository('Playlist');
    const playlistDataAll = await playlistRepository.find({
        where:{
            users:{ id:userId}
        },
        relations:['users']
    });
    const playlistAll = playlistDataAll;


    res.render('playlists', {
    user: req.user,
    users,
    playlistAll,
    layout: 'main',
    title: 'Playlist',
    });
};

export const detailPlaylist = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const playlistId = req.params.id; 

    const playlistRepository = DataSource.getRepository('Playlist');
    const playlistData = await playlistRepository.findOne({
        where: {
            id: playlistId,
        },
        relations: ['songs', 'users', 'songs.clients', 'songs.artist', 'songs.album', 'songs.playlists']
    });

    if (playlistData) {
        const playlistDetail = playlistData;
        const playlistTitle = playlistDetail.name;

        res.render('playlist-detail', {
            user: req.user,
            users,
            playlistDetail,
            layout: 'main',
            title: playlistTitle 
        });
    } else {
        res.status(404).send('Playlist not found');
    }
};

export const playlistsAll = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const users = await userRepository.find();
    const userId = req.user.id; 
    
    const playlistRepository = DataSource.getRepository('Playlist')
    const playlistData = await playlistRepository.find({
        relations:['users']
        });

    const playlistsAll = playlistData;
    res.render('allPlaylists', {
    user: req.user,
    playlistsAll,
    users,
    title: "My Playlists"
    });
}

export const createPlaylist = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const tokenDeco = jwt.decode(token);

    if (!req.body.name) {
      throw new Error('Please provide a name for the playlist.');
    }

    const playlistRepository = DataSource.getRepository('Playlist');

    const usersId = req.user.id;

    const playlist = await playlistRepository.findOne({
      where: {
        name: req.body.name,
        users: usersId,
      },
    });

    if (playlist) {
      res.status(200).send({ status: `Playlist with name ${playlist.name} already exists.` });
      return;
    }

    req.body.users = usersId;

    console.log('Playlist Request:', req.body);

    const createdPlaylist = await playlistRepository.create(req.body);
    const savedPlaylist = await playlistRepository.save(createdPlaylist);

    res.status(200).redirect('/playlists').send({ status: `Created album with id ${savedPlaylist.id}.` });
  } catch (error) {
    next(error.message);
  }
};

export const deletePlaylist = async (req, res, next) => {
  console.log('Deleting playlist');
  try {
    const playlistId = req.params.id;

    const playlistRepository = DataSource.getRepository('Playlist');

    const userId = req.user.id;

    const playlist = await playlistRepository.findOne({
      where: {
        id: playlistId,
        users: userId,
      },
    });

    if (!playlist) {
      res.status(404).send({ error: 'Playlist not found.' });
      return;
    }

    await playlistRepository.delete(playlistId);
    res.redirect('/playlists');
    res.locals.alertMessage = 'Playlist successfully deleted!';
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  console.log('Updating playlist');
  try {
    const playlistId = req.params.id;
    const updatedName = req.body.name;

    if (!updatedName) {
      throw new Error('Please provide a name for the updated playlist.');
    }

    const playlistRepository = DataSource.getRepository('Playlist');
    const playlist = await playlistRepository.findOne({
      where: {
        id: playlistId,
      },
    });

    if (!playlist) {
      res.status(404).send({ error: 'Album not found.' });
      return;
    }

    playlist.name = updatedName;

    const updatedAlbum = await playlistRepository.save(playlist);
    res.redirect('/playlists');
  } catch (error) {
    console.log('Oopsie daisy, er ging iets mis', error);
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const songId = req.body.id; 
    const playlistId = req.params.id; 

    const songRepository = DataSource.getRepository('Song');
    const playlistRepository = DataSource.getRepository('Playlist');

    const song = await songRepository.findOne({
      where: {
        id: songId
      },
      relations: ['playlists'] 
    });

    console.log('Playlist Request:', playlistId);
    console.log('song Request:', songId);

    if (song) {
      const playlistD = await playlistRepository.findOne({
        where: {
          id: playlistId
        }
      });

      if (playlistD) {
        song.playlists = song.playlists.filter(playlist => playlist.id !== playlistId);
        await songRepository.save(song);
        res.redirect('/discover');
      } else {
        res.status(404).json({ success: false, message: 'Playlist not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};








