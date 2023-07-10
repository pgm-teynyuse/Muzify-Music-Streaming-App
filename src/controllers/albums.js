import DataSource from '../lib/DataSource.js';

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