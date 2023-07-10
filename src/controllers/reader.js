/* eslint-disable import/prefer-default-export */
import DataSource from '../lib/DataSource.js';

export const reader = async (req, res) => {
  res.render('reader', {
    layout: 'reader',
    title: 'Muzify',
  });
};
