/* eslint-disable import/prefer-default-export */
import DataSource from '../../lib/DataSource.js';

export const getUsers = async (req, res, next) => {
  try {
    // get the user repository
    const userRepository = DataSource.getRepository('User');

    // send back to client
    res.status(200).json(await userRepository.find({
      relations: ['role'],
    }));
  } catch (error) {
    next(error.message);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    // get the user repository
    const userRepository = DataSource.getRepository('User');

    // find the user by ID
    const user = await userRepository.findOne({
          where: {
      id: userid,
    },
      relations: ['role'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // send the user back to the client
    res.status(200).json(user);
  } catch (error) {
    next(error.message);
  }
};

