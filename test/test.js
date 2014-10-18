var iso = require('..');

describe('iso-test', function() {
  it('should work', function(done) {
    this.timeout(0);
    iso(
      {basedir: __dirname + '/browser'},
      done
    );
  });

  it('should wait for user to close', function(done) {
    this.timeout(0);
    iso(
      {basedir: __dirname + '/browser', manual: true},
      done
    );
  });
});
