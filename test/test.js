var iso = require('..');

describe('iso-test', function() {
  it('should automatically run a single test', function(done) {
    this.timeout(0);
    iso(
      {
        title: 'Single auto test',
        basedir: __dirname + '/browser',
        tests: ['simple']
      },
      done
    );
  });

  it('should update iso global with current test info', function(done) {
    this.timeout(0);
    iso(
      {
        title: 'Server iso global',
        basedir: __dirname + '/browser',
        tests: ['server']
      },
      done
    );
  });

  it('should let tester run the tests', function(done) {
    this.timeout(0);
    iso(
      {
        title: 'Manual tests',
        basedir: __dirname + '/browser',
        tests: ['simple', 'simple2'],
        manual: true
      },
      done
    );
  });

  it('should ignore multiple reports', function(done) {
    this.timeout(0);
    iso(
      {
        title: 'Ignore multiple reports',
        basedir: __dirname + '/browser',
        tests: ['multiple'],
        manual: true
      },
      done
    );
  });
});
