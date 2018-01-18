//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

var io = require('socket.io').listen(app); //SocketIO - Seccion 1

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

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

module.exports = app ;