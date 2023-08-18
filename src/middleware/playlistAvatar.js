/* eslint-disable prettier/prettier */
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import DataSource from '../lib/DataSource.js';
import { PUBLIC_PATH } from '../consts.js';

export const playlistAvatar = async (req, res, next) => {
  const { file, body } = req;

  console.log(file);

  // if no file is sent, skip this middleware
  if (!file) return next();

  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/gif'
  ) {
    try {
      const playlistRepository = DataSource.getRepository('Playlist');
      const playlistId = req.body.playlistId;
      const playlist = await playlistRepository.findOne({
        where: {
          id: playlistId,
        },
        relations:['users']
      });

      const userRepository = DataSource.getRepository('User');
      const userId = req.body.id;
      const user = await userRepository.findOne({
        where: {
          id: userId,
        },
      });

      console.log(-playlist.id)
      if (playlist) {
        // Use the username of the user as part of the filename
        const originalFilename = `${playlist.name}${playlist.id}`;

        await sharp(file.buffer)
          .resize(300, 300, {
            fit: sharp.fit.cover,
            withoutEnlargement: true,
          })
          .toFile(`${PUBLIC_PATH}/images/${originalFilename}.png`);
          console.log(user)
      } else {
        console.log('User not found'); // console
        res.send('User not found'); // browser
      }
    } catch (error) {
      console.log('Error retrieving user from the database:', error); // console
      res.send('Error retrieving user from the database'); // browser
    }
  } else {
    console.log('File type not supported'); // console
    res.send('File type not supported'); // browser
  }

  next();
};

