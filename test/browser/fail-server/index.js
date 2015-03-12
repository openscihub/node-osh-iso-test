var iso = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    iso.fail('Actually, success; fail() was called successfully on server');
  });
  done();
};
