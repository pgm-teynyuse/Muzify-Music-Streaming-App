import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import DataSource from '../lib/DataSource.js';

export const register = async (req, res) => {
  // errors
  const { formErrors } = req;

  // input fields
  const inputs = [
    {
      name: 'firstName',
      label: 'Voornaam',
      type: 'text',
      value: req.body?.firstName ? req.body.firstName : '',
      error: req.formErrorFields?.firstName ? req.formErrorFields.firstName : null,
    },
    {
      name: 'lastName',
      label: 'Achternaam',
      type: 'text',
      value: req.body?.lastName ? req.body.lastName : '',
      error: req.formErrorFields?.lastName ? req.formErrorFields.lastName : null,
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'text',
      value: req.body?.email ? req.body.email : '',
      error: req.formErrorFields?.email ? req.formErrorFields.email : null,
    },
    {
      name: 'username',
      label: 'Gebruikersnaam',
      type: 'text',
      value: req.body?.username ? req.body.username : '',
      error: req.formErrorFields?.username ? req.formErrorFields.username : null,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      password: req.body?.password ? req.body.password : '',
      error: req.formErrorFields?.password
        ? req.formErrorFields.password
        : null,
    },
  ];

  // get the roles
  const roleRepository = await DataSource.getRepository('Role');
  const roles = await roleRepository.find();

  // render the register page
  res.render('register', {
    layout: 'authentication',
    inputs,
    formErrors,
    roles,
  });
};

export const postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // if we have validation errors
    if (!errors.isEmpty()) {
      // create an object with the error fields
      const errorFields = {};
      // iterate over the errors
      errors.array().forEach((error) => {
        errorFields[error.param] = error.msg;
      });
      // put the errorfields in the current request
      req.formErrorFields = errorFields;

      return next();
    }
    // make user repository instance
    const userRepository = await DataSource.getRepository('User');
    const roleRepository = await DataSource.getRepository('Role');

    const userExists = await userRepository.findOne({
      where: {
        email: req.body.email,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });

    const role = await roleRepository.findOne({
      where: {
        label: req.body.role,
      },
    });

    if (!role) {
      req.formErrors = [{ message: 'Rol bestaat niet.' }];
      return next();
    }

    if (userExists) {
      req.formErrors = [{ message: 'Gebruiker bestaat al.' }];
      return next();
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // create a new user
    const user = await userRepository.create({
      email: req.body.email,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      role,
    });

    // save the user
    await userRepository.save(user);

    res.redirect('/login');
  } catch (e) {
    next(e.message);
  }
};

export const login = async (req, res) => {
  // errors
  const { formErrors } = req;

  // input fields
  const inputs = [
    {
      name: 'email',
      label: 'E-mail',
      type: 'text',
      value: req.body?.email ? req.body.email : '',
      error: req.formErrorFields?.email ? req.formErrorFields.email : null,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      password: req.body?.password ? req.body.password : '',
      error: req.formErrorFields?.password
        ? req.formErrorFields.password
        : null,
    },
  ];

  // render the login page
  res.render('login', {
    layout: 'authentication',
    // toevoegen van data aan de view
    inputs,
    formErrors,
  });
};

export const postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // if we have validation errors
    if (!errors.isEmpty()) {
      // create an object with the error fields
      const errorFields = {};
      // iterate over the errors
      errors.array().forEach((error) => {
        errorFields[error.param] = error.msg;
      });
      // put the errorfields in the current request
      req.formErrorFields = errorFields;

      return next();
    }
    // get the user
    const userRepository = await DataSource.getRepository('User');
    // change email to lowercase letters
    const lwEmail = req.body.email.toLowerCase();

    // get a user with a specific email adress
    const user = await userRepository.findOne({
      where: {
        email: lwEmail,
      },
    });

    // authentication validation
    if (!user) {
      req.formErrors = [{ message: 'Gebruiker bestaat niet.' }];
      return next();
    }

    // compare hashed password with saved hashed password
    const givenPassword = req.body.password; // supersecret
    const dbPassword = user.password; // $2b$10$9sWBzAraG2EQHZs62uyVdeH2dJxDAM4aWwlcNKWHAX.m2ZUjneEQa
    const isAMatch = bcrypt.compareSync(givenPassword, dbPassword); // true or false

    // password check
    if (!isAMatch) {
      req.formErrors = [{ message: 'Wachtwoord is niet correct.' }];
      return next();
    }
    console.log(user);
    // create the JWT web token, aka our identity card
    const token = jwt.sign(
      { id: user.id, email: req.body.email },
      process.env.TOKEN_SALT,
      { expiresIn: '1h' },
    );

    // create a cookie and add this to the response
    res.cookie('token', token, { httpOnly: true });

    // redirect to our root
    res.redirect('/');
  } catch (e) {
    next(e.message);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
