var serveStatic = require('serve-static');
var iso = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    res.send(
      '<html>' +
      '<body>' +
      '<div id="testName">' + iso.testName + '</div>' +
        '<script src="/iso.js"></script>' +
        '<script src="/main.js"></script>' +
      '</body>' +
      '</html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
