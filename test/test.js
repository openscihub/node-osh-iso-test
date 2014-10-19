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

  it('should execute only given tests', function(done) {
    this.timeout(0);
    iso(
      {
        basedir: __dirname + '/browser',
        tests: ['simple'],
        manual: false
      },
      done
    );
  });
});
