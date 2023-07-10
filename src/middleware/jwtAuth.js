/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import DataSource from '../lib/DataSource.js';

export const jwtAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    // get the payload data out of the token
    const { id } = jwt.verify(token, process.env.TOKEN_SALT);

    // get the user out of the database
    const userRepository = DataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id }, relations: ['role'] });

    // remove the password from the user object
    // so we don't send it to the client, ever, ever, ever
    user.password = '';

    req.user = user;

    // go to the next chain
    next();
  } catch (e) {
    // console.log('er ging iets mis', e); return;
    res.clearCookie('token');
    return res.redirect('/reader');
  }
};
