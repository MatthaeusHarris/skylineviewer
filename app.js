var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var credentials = require('./credentials');
var session = require('express-session');
var uri = 'mongodb://localhost/skylineviewer';
mongoose.connect(uri);

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

var routes = require('./routes/index');
var user = require('./routes/user');
var map = require('./routes/map');

var app = express();

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser(credentials.cookieSecret));
app.use(session({
  secret: credentials.cookieSecret,
  saveUninitialized: true,
  resave: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('combined'));

app.use(require('csurf')());

app.use(function(req, res, next) {
  res.locals._csrfToken = req.csrfToken();
  next();
});

app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

var auth = require('./lib/auth');
auth.initialize(app);
auth.registerRoutes(app);

app.use('/', routes);
app.use(user);
app.use(map);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
