var serveStatic = require('serve-static');

module.exports = function(app, done) {
  var test = this;

  app.get('/', function(req, res) {
    res.send(
      '<html>' +
      '<body>' +
        '<script src="/stem.js"></script>' +
        '<script src="/main.js"></script>' +
      '</body>' +
      '</html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
