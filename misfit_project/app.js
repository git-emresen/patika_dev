
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var session=require('express-session');
var mongoStore=require('connect-mongo');
var config = require('./config');

var app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({
    mongoUrl: config.CONNECTION_STRING,
    touchAfter: 24 * 3600 // 24 saat
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 gün
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // HTTPS'de true
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// view engine setup
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
/* app.use(express.static(path.join(__dirname, 'public'))); */
// eslint-disable-next-line no-undef
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  next(createError(404));
}); */


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.user = req.session ? req.session.user || null : null;
  res.locals.isAuthenticated = !!(req.session && req.session.user);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
