var serveStatic = require('serve-static');
var iso = require('../../..');

module.exports = function(app, done) {
  app.get('/', function(req, res) {
    console.log(iso.name, iso.route, iso.manual);
    res.send(
      '<html>' +
      '<body>' +
      '<div id="route">' + iso.route + '</div>' +
      iso.iso +
      iso.script('/main.js') +
      '</body>' +
      '</html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
