var iso = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    iso.ok('ok() was called successfully on server');
  });
  done();
};
