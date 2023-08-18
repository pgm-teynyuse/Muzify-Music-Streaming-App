/* eslint-disable prettier/prettier */
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import DataSource from '../lib/DataSource.js';
import { PUBLIC_PATH } from '../consts.js';

export const saveAvatar = async (req, res, next) => {
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
      const albumRepository = DataSource.getRepository('Album');
      const albumId = req.body.albumId;
      const album = await albumRepository.findOne({
        where: {
          id: albumId,
        },
        relations:['artist']
      });

      const userRepository = DataSource.getRepository('User');
      const userId = req.body.id;
      const user = await userRepository.findOne({
        where: {
          id: userId,
        },
      });

      console.log(album.id)
      if (album) {
        // Use the username of the user as part of the filename
        const originalFilename = `${album.artist.firstName}${album.artist.lastName}${album.name}`;

        await sharp(file.buffer)
          .resize(128, 128, {
            fit: sharp.fit.cover,
            withoutEnlargement: true,
          })
          .toFile(`${PUBLIC_PATH}/images/album/${originalFilename}.png`);
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

