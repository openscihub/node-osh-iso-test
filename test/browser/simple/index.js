var serveStatic = require('serve-static');

module.exports = function(app, done) {
  var test = this;

  app.get('/', function(req, res) {
    res.send(
      '<html>' +
      '<body>' +
      test.iso +
      test.script('/main.js') +
      '</body>' +
      '</html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
