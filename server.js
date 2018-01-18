// var express = require('express');
// var path = require('path');
// //var favicon = require('serve-favicon');
// //var logger = require('morgan');
// //var cookieParser = require('cookie-parser');
// //var bodyParser = require('body-parser');

// var routes = require('./server/routes/index');
// var users = require('./server/routes/users');
// var todos = require('./server/routes/todos');

// // load mongoose package
// var mongoose = require('mongoose');

// // Use native Node promises
// mongoose.Promise = global.Promise;

// // connect to MongoDB
// mongoose.connect('mongodb://localhost/admin')
//   .then(() =>  console.log('connection succesful'))
//   .catch((err) => console.error(err));

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// //app.use(logger('dev'));
// //app.use(bodyParser.json());
// //app.use(bodyParser.urlencoded({ extended: false }));
// //app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);
// app.use('/todos', todos);

// // catch 404 and forward to error handler
// // app.use(function(req, res, next) {
// //   var err = new Error('Not Found');
// //   err.status = 404;
// //   next(err);
// // });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// //module.exports = app;

// /**
//  * Module dependencies.
//  */
// var debug = require('debug')('todo-api:server');
// var http = require('http');

// /**
//  * Get port from environment and store in Express.
//  */

// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

// /**
//  * Create HTTP server.
//  */

// var server = http.createServer(app);

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

// /**
//  * Normalize a port into a number, string, or false.
//  */

// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }

//****************************************************//


// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
//const api = require('./server/routes/api');
var users = require('./server/routes/users');
var todos = require('./server/routes/todos');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set our api routes
//app.use('/api', api);
app.use('/api/users', users);
app.use('/api/todos', todos);

//Importando modelo users
var modelUser = require('./server/models/user');
app.use('/user', modelUser);

// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
// --Comentado por test 18-01-2018
// mongoose.connect('mongodb://localhost/admin')
//   .then(() =>  console.log('connection succesful to localhost mongodb'))
//   .catch((err) => console.error(err));


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);


var io = require('socket.io').listen(server); //SocketIO - Seccion 1
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

//SocketIO - Seccion 2
io.set("origins", "*:*");
 
var currentPrice = [{'id':1,'msj':'Welcome aboard!','owner':'SIT'}];


io.on('connection', function (socket) {
	socket.emit('priceUpdate',currentPrice);
	socket.on('bid', function (data) {
		currentPrice = data;
		socket.emit('priceUpdate',currentPrice);
		socket.broadcast.emit('priceUpdate',currentPrice);
	});

});

console.log('current price:'+currentPrice);