var http = require('http');
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Class = require('osh-class');


var isoJs = fs.readFileSync(
  __dirname + '/browser.js',
  {encoding: 'utf8'}
);


var Test = Class({
  constructor: function(opts) {
    this.name = opts.name;
    this.route = '/' + opts.name;
  },

  iso: '<script src="/iso.js"></script>',

  script: function(opts) {
    if ('string' == typeof opts) {
      opts = {path: opts};
    }

    return (
      '<script ' +
        (opts.async ? 'async ' : '') +
        'src="/' + this.name + opts.path + '" ' +
      '>' +
      '</script>'
    );
  }
});



function iso(opts, done) {

  var basedir = opts.basedir;
  var port = opts.port || 3333;
  var manual = opts.manual;
  var auto = !manual;

  var server;
  var sockets = {};
  var nextSocketId = 0;

  var runner = express();
  runner.use(morgan('combined'));

  var testIndex = -1;
  var results = [];
  var tests = (
    opts.tests ||
    fs.readdirSync(basedir).filter(function(file) {
      if (file[0] !== '.') {
        file = path.resolve(basedir, file);
        return fs.statSync(file).isDirectory();
      }
    })
  );

  async.each(tests, register, function(err) {
    if (err) done(err);
    else start();
  });

  function register(name, done) {
    var dir = path.resolve(basedir, name);
    var app = express();
    var init = require(dir);
    runner.use('/' + name, app);
    init.call(Test({name: name}), app, done);
  }

  function start() {
    runner.get('/', home);
    runner.get('/iso.js', script);

    server = http.createServer(runner);
    server.on('connection', handleConnection);
    server.listen(port, function(err) {
      if (err) done(err);
      else {
        console.log('Browser to http://localhost:' + port + '.');
        process.on('SIGINT', end);
      }
    });
  }

  function handleConnection(socket) {
    // Add a newly connected socket
    var socketId = nextSocketId++;
    sockets[socketId] = socket;
    //console.log('socket', socketId, 'opened');
    
    // Remove the socket when it closes
    socket.once('close', function() {
      //console.log('socket', socketId, 'closed');
      delete sockets[socketId];
    });
  }

  function home(req, res) {
    var result = req.query.result;
    var exit = req.query.exit;
    var nextTest;

    if (result) {
      nextTest = tests[++index];
      results.push(result);
    }
    else {
      index = 0;
      nextTest = tests[index];
      results = [];
    }

    res.set('cache-control', 'no-cache');
    res.send(
      '<html><body>' +
      '<ul>' +
      results.map(function(result, index) {
        return '<li>' + tests[index] + ': ' + result + '</li>';
      }).join('') +
      '</ul>' +
      (
        (manual && !exit) ?
        '<a href="/?exit=1"><button>Finish</button></a>' : ''
      ) +
      (
        (nextTest && !exit) ?
        '<script>document.location = "/' + nextTest + '";</script>' :
        ''
      ) +
      '</body></html>'
    );

    if (exit || (!nextTest && auto)) end();
  }

  function script(req, res) {
    res.send(
      isoJs +
      'iso.test = "' + tests[index] + '";' +
      'iso.route = "/' + tests[index] + '";'
    );
  }

  function end() {
    console.log('Stopping server...');
    // Close the server
    server.removeListener('connection', handleConnection);
    server.close(function(err) {
      //console.log('Server closed!');
      server = runner = null;
      done(err);
    });

    // Destroy all open sockets
    for (var socketId in sockets) {
      //console.log('socket', socketId, 'destroyed');
      sockets[socketId].destroy();
    }

    process.removeListener('SIGINT', end);
  }
}

module.exports = iso;
