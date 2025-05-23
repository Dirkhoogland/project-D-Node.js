var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger/swagger.json');
var open = require('open').default;
const swaggerSpecs = require('./config/swagger-config');


// AVAILABLE PAGES ==================================
var indexRouter = require('./routes/index');
var exampleRouter = require('./routes/example');
var sqlTestingRouter = require('./routes/sqlTest');
// ==================================================

var app = express();
open("http://localhost:3000/api-docs/#/default");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAPI documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main routes ==================================================
app.use('/', indexRouter);
app.use('/example', exampleRouter);
app.use('/sqlTest', sqlTestingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
