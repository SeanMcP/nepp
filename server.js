const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash-messages');
const routes = require('./routes/index');
const User = require('./models/user');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

// This block is hanging everything
app.use(session({
  secret: 'mellon',
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
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

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(routes);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
