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

    console.log(playlistAll);

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
        where:{
            id:playlistId,
        },
        relations:['songs']
    });

    const playlistDetail = playlistData;

    console.log(playlistDetail);

    res.render('playlist-detail', {
    user: req.user,
    users,
    playlistDetail,
    layout: 'main',
    title: 'Playlist',
    });
};






