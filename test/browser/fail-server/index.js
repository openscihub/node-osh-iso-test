var stem = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    stem.fail('Actually, success; fail() was called successfully on server');
  });
  done();
};
