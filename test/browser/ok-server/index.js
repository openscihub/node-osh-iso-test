var stem = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    stem.ok('ok() was called successfully on server');
  });
  done();
};
