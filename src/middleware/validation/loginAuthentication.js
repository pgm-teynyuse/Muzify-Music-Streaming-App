import { body } from 'express-validator';

export default [
  body('email').isEmail().withMessage('Geef een geldig e-mailadres op'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Het wachtwoord moet tussen de 8 en 20 karakters zijn'),
];
