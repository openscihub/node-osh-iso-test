var serveStatic = require('serve-static');

module.exports = function(app, done) {
  var route = this.route;

  app.get('/', function(req, res) {
    res.send(
      '<html>' +
      '<body>' +
      '<script src="/iso.js"></script>' +
      '<script src="' + route + '/main.js"></script>' +
      '</body>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
