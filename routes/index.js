const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/index').User;

router.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});

router.post('/user', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // Checks that request includes a username and password
  if (!username || !password) {
    res.status(400).send('Please fill provide a username and password');
  } else {

    let salt = bcrypt.genSaltSync(8);
    let hashedPassword = bcrypt.hashSync(password, salt);

    let newUser = {
      username,
      salt,
      hashedPassword
    };

    User.create(newUser)
    .then(data => {
      res.status(200).send({
        status: 'success',
        data
      })
    })
    .catch(err => {
      res.status(400).send({
        status: 'fail',
        data: err
      })
    })
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure',
  failureFlash: true
}));

router.get('/:status', (req, res) => {
  let status = req.params.status === 'success' ? 200 : 400;
  res.status(status).send(req.params.status);
})

module.exports = router;
