var http = require('http');
var morgan = require('morgan');
var express = require('express');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Class = require('osh-class');
var serveStatic = require('serve-static');
var Cookies = require('cookies');
var extend = require('xtend/mutable');
var crypto = require('crypto');

var stemJs = fs.readFileSync(
  __dirname + '/browser.js',
  {encoding: 'utf8'}
);


function Test(opts) {
  this.testName = opts.testName;
  this.route = '/' + opts.testName;
}

extend(Test.prototype, {
  stem: '<script src="/stem.js"></script>',

  script: function(opts) {
    if ('string' == typeof opts) {
      opts = {path: opts};
    }

    return (
      '<script ' +
        (opts.async ? 'async ' : '') +
        'src="' + this.route + opts.path + '" ' +
      '>' +
      '</script>'
    );
  }
});


function stem(opts, done) {

  var basedir = opts.basedir;
  var port = opts.port || 3333;
  var manual = !!opts.manual;
  var auto = !manual;
  var title = opts.title || 'Tests';
  var debug = opts.debug;
  var id = crypto.pseudoRandomBytes(4).toString('hex');
  var stemRoute = '/__stem';
  var apps = {};

  var server;
  var sockets = {};
  var nextSocketId = 0;

  var runner = express();
  debug && runner.use(morgan('combined'));

  var testIndex = 0;
  var results = {};
  var currentTest;
  var tests = (
    opts.tests ||
    fs.readdirSync(basedir).filter(function(file) {
      if (file[0] !== '.') {
        file = path.resolve(basedir, file);
        return fs.statSync(file).isDirectory();
      }
    })
  );

  runner.use(function(req, res, next) {
    stem.fail = stem.ok = function(msg) {
      res.redirect(stemRoute + '/?test=' + currentTest + '&result=' + msg);
    };
    next();
  });

  async.each(tests, register, function(err) {
    if (err) done(err);
    else start();
  });

  function register(testName, done) {
    var dir = path.resolve(basedir, testName);
    var app = express();
    var init = require(dir);
    runner.use(stemRoute + '/' + testName, function(req, res, next) {
      var info = {
        testName: testName,
        manual: manual
      };
      extend(stem, info); // export current test info for server logic.
      var cookies = new Cookies(req, res);
      cookies.set(
        'stem',
        JSON.stringify(info),
        {httpOnly: false}
      );
      currentTest = testName;
      res.redirect('/');
    });
    init.call(
      new Test({testName: testName}),
      app,
      done
    );
    apps[testName] = app;
  }

  function start() {
    runner.get(stemRoute, home);
    runner.get('/stem.js', script);
    runner.use(serveStatic(__dirname + '/styles'));
    runner.use('/', serveTest);

    server = http.createServer(runner);
    server.on('connection', handleConnection);
    server.listen(port, function(err) {
      if (err) done(err);
      else {
        console.log('Browser to http://localhost:' + port + stemRoute + '.');
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

  function serveTest(req, res, next) {
    if (currentTest) apps[currentTest](req, res);
    else next();
  }

  function home(req, res) {
    var result = req.query.result;
    var testName = req.query.test;
    var exit = req.query.exit;
    var nextTest;

    results[testName] = result;
    if (auto && testIndex < tests.length) {
      nextTest = tests[testIndex];
    }

    res.set('cache-control', 'no-cache');
    res.send(
      '<html>' +
      '<head>' +
        '<link rel="stylesheet" href="/main.css" type="text/css">' +
      '</head>' +
      '<body>' +
      '<h2>' + title + '</h2>' +
      '<ul>' +
      tests.map(function(testName, index) {
        return (
          '<li>' +
            (manual ? ('<a class="run" href="' + stemRoute + '/' + testName + '">Run</a>') : '') +
            '<b>' + testName + '</b>' +
            (results[testName] ? ': ' + results[testName] : '') +
          '</li>'
        );
      }).join('') +
      '</ul>' +
      (
        (manual && !exit) ?
        '<a href="' + stemRoute + '?exit=1">Finish</a>' : ''
      ) +
      (
        auto && testIndex < tests.length ?
        '<script>document.location = "' + stemRoute + '/' + nextTest + '";</script>' :
        ''
      ) +
      '</body></html>'
    );

    if (exit || (auto && testIndex === tests.length)) {
      end();
    }
    else if (auto) {
      testIndex++;
    }
  }

  function script(req, res) {
    res.send(stemJs);
    //  stemJs +
    //  'stem.name = "' + currentTest + '";' +
    //  'stem.route = "/' + currentTest + '";' +
    //  'stem.manual = ' + manual + ';'
    //);
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

extend(stem, Test.prototype, {
  fail: function(msg) {

  },

  ok: function(msg) {

  }
});

module.exports = stem;
