var http = require('http');
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Class = require('osh-class');

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

  var runner = express();
  runner.use(morgan('combined'));

  var tests = fs.readdirSync(basedir).filter(function(file) {
    if (file[0] !== '.') {
      file = path.resolve(basedir, file);
      //console.log(file);
      return fs.statSync(file).isDirectory();
    }
  });

  async.each(
    tests,
    function(name, done) {
      var dir = path.resolve(basedir, name);

      var app = express();
      var init = require(dir);

      runner.use('/' + name, app);

      init.call(
        Test({name: name}),
        app,
        done
      );
    },
    start
  );

  function start() {
    var i = -1;
    var results = [];
    runner.get('/', function(req, res) {
      var result = req.query.result;
      var nextTest;
      if (result) {
        nextTest = tests[++i];
        results.push(result);
      }
      else {
        i = 0;
        nextTest = tests[i];
        results = [];
      }
      res.send(
        '<html><body>' +
        '<ul>' +
        results.map(function(result, index) {
          return '<li>' + tests[index] + ': ' + result + '</li>';
        }).join('') +
        '</ul>' +
        (
          nextTest ?
          '<script>document.location = "/' + nextTest + '";</script>' :
          ''
        ) +
        '</body></html>'
      );
    });

    var isoJs = fs.readFileSync(
      __dirname + '/browser.js',
      {encoding: 'utf8'}
    );

    runner.get('/iso.js', function(req, res) {
      res.send(
        isoJs +
        'iso.test = "' + tests[i] + '";' +
        'iso.route = "/' + tests[i] + '";'
      );
    });

    var server = http.createServer(runner);
    server.listen(port, function() {
      console.log('Browser to http://localhost:' + port + '. Ctrl-C to finish.');
      process.on('SIGINT', function() {
        console.log('Stopping server...');
        server && server.close();
        process.exit();
      });
    });
  }
}

module.exports = iso;
