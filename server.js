var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

var port = process.env.PORT || 8000,
  db_url = process.env.MONGOLAB_URI || 'mongodb://localhost/capa-pin-store';

var prepare = function(){
  var app = express();

  var CAPA = mongoose.model('CAPA', mongoose.Schema({
    data: String
  }));

  app.use(bodyParser());
  app.use(methodOverride());

  app.get('/', function(req, res){
    var ret = {}, status = 200;
    var done = function(){
      res.status(status);
      if(req.param('cb')){
        res.type('application/javascript');
        res.send(req.param('cb') + '(' + JSON.stringify(ret) + ');');
      }else{
        res.send(ret);
      }
    };
    CAPA.find({}, function(error, capas){
      if(error){
        status = 500;
        ret = {'status':'bad', 'name': 'DB Error', 'error': error};
      }else{
        ret = capas;
      }
      done();
    });
  });

  app.post('/', function(req, res){
    var ret = {}, status = 200;
    var done = function(){
      res.status(status);
      if(req.param('cb')){
        res.type('application/javascript');
        res.send(req.param('cb') + '(' + JSON.stringify(ret) + ');');
      }else{
        res.send(ret);
      }
    };
    if(!req.body.data){
      status = 500;
      ret = {'status': 'bad', 'error': 'No data specified in request.'};
      done();
    }else{
      var capa = new CAPA({'data': req.body.data});
      capa.save(function(error, capa){
        if(error){
          status = 500;
          ret = {'status':'bad', 'name': 'DB Error', 'error': error};
        }else{
          ret = {'status': 'ok', capa: capa};
        }
        done();
      });
    }
  });

  app.use(express.static(__dirname + '/public'));

  var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
  });
};

module.exports = function () {
  'use strict';

  mongoose.connect(db_url);

  var connection = mongoose.connection;

  connection.on('error', console.error.bind(console, 'connection error: '));
  connection.once('open', prepare)
};