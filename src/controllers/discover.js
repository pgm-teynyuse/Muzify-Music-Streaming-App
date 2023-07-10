import DataSource from '../lib/DataSource.js';

export const client = async (req, res) => {
    const userRepository = DataSource.getRepository('User');
    const albumRepository = DataSource.getRepository('Album')
    const users = await userRepository.find();

    const albumDataAll = await albumRepository.find({
    });
    const albumsAll = albumDataAll;
    
    res.render('discover', {
    user: req.user,
    users,
    albumsAll,
    layout: 'main',
    title: 'Discover',
    });
};

export const addToFavorites = async (req, res) => {
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


export const removeFromFavorites = async (req, res) => {
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


