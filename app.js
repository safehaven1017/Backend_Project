const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./models')
const store = new SequelizeStore({ db: db.sequelize })

const usersApiRouter = require('./routes/api/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret', // used to sign the cookie
    resave: false, // update session even w/ no changes
    saveUninitialized: true, // always create a session
    cookie: {
      secure: false, // true: only accept https req's
      maxAge: 2592000000, // time in seconds
    },
    store: store
  })
);
store.sync();
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/users', usersApiRouter);



module.exports = app;