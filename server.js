const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/index').User;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(morgan('dev'));

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash('error');
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({
      where: { 'username': username }
    })
    .then(user => {
      if (user == null) {
        return done(null, false, { message: 'Incorrect credentials.' });
      }

      let hashedPassword = bcrypt.hashSync(password, user.salt);

      if (user.hashedPassword === hashedPassword) {
        return done(null, user);
      }

      return done(null, false, { message: 'Incorrect credentials.' });
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({
    where: { 'id': id }
  })
  .then(user => {
    if (user == null) {
      done(new Error('Wrong user id.'));
    }
    done(null, user);
  })
})

app.use(routes);

app.listen(3000, () => {
  console.log('App is running on localhost:3000');
})
