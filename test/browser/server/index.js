var serveStatic = require('serve-static');
var stem = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    console.log(stem.testName, stem.route, stem.manual);
    res.send(
      '<html>' +
      '<body>' +
      '<div id="testName">' + stem.testName + '</div>' +
        '<script src="/stem.js"></script>' +
        '<script src="/main.js"></script>' +
      '</body>' +
      '</html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
