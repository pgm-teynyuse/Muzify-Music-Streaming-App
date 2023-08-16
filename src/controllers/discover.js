import DataSource from '../lib/DataSource.js';

export const discover = async (req, res) => {
  const userRepository = DataSource.getRepository('User');
  const albumRepository = DataSource.getRepository('Album');
  const songRepository = DataSource.getRepository('Song');
  const playlistRepository = DataSource.getRepository('Playlist');
  const userId = req.user.id;
  const roleId = 3

  try {
    const users = await userRepository.find();
    const albumDataAll = await albumRepository.find({
      relations:['artist'],
      take: 3,
    });

    const playlistDataAll = await playlistRepository.find({
      where:{
        users:{ role: {id:roleId} },
      },
      take: 5,
      relations:['users']
    });
    
    const songDataAll = await songRepository.find({
      relations: ['artist', 'album'],
      take: 10,
    });

    const albumsAll = albumDataAll;
    const songsAll = songDataAll;
    const playlists = playlistDataAll;

    // Randomly shuffle the albums and songs arrays
    shuffleArray(albumsAll);
    shuffleArray(songsAll);

console.log(playlists)

    res.render('discover', {
      user: req.user,
      users,
      albumsAll,
      songsAll,
      playlists,
      layout: 'main',
      title: 'Discover',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const addAlbumToFavorites = async (req, res) => {
try {
    const albumId = req.params.id; // ID van het geselecteerde album, afhankelijk van hoe het wordt doorgegeven
    const userId = req.user.id; // ID van de ingelogde gebruiker

    const albumRepository = DataSource.getRepository('Album');
    const userRepository = DataSource.getRepository('User');

    const album = await albumRepository.findOne({
    where: {
        id: albumId
    },
      relations: ['clients'] // Inclusief de many-to-many-relatie 'clients'
    });

    const user = await userRepository.findOne({
    where: {
        id: userId
    }
    });

    if (album && user) {
      album.clients.push(user); // Voeg de ingelogde gebruiker toe aan de clients van het album
    await albumRepository.save(album);
    res.redirect('/discover');
    } else {
    res.status(400).json({ error: 'Album or user not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addSongToFavorites = async (req, res) => {
  try {
    const songId = req.params.id; // ID of the selected song, depending on how it is passed
    const userId = req.user.id; // ID of the logged-in user

    const songRepository = DataSource.getRepository('Song');
    const userRepository = DataSource.getRepository('User');

    const song = await songRepository.findOne({
      where: {
        id: songId
      },
      relations: ['clients'] // Including the many-to-many relationship 'users'
    });

    const user = await userRepository.findOne({
      where: {
        id: userId
      }
    });

    if (song && user) {
      song.clients.push(user); // Add the logged-in user to the users of the song
      await songRepository.save(song);
      res.redirect('/likedSongs');
    } else {
      res.status(400).json({ error: 'Song or user not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
        res.redirect('/discover');
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
        res.redirect('/discover');
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













