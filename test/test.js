var stem = require('..');

describe('stem-test', function() {
  it('should automatically run a single test', function(done) {
    this.timeout(0);
    stem(
      {
        title: 'Single auto test',
        basedir: __dirname + '/browser',
        tests: ['simple']
      },
      done
    );
  });

  it('should update stem global with current test info', function(done) {
    this.timeout(0);
    stem(
      {
        title: 'Server stem global',
        basedir: __dirname + '/browser',
        tests: ['server']
      },
      done
    );
  });

  it('should allow fail on server', function(done) {
    this.timeout(0);
    stem(
      {
        title: 'Fail on server',
        basedir: __dirname + '/browser',
        tests: ['fail-server', 'ok-server'],
        manual: true
      },
      done
    );
  });

  it('should let tester run the tests', function(done) {
    this.timeout(0);
    stem(
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
    stem(
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
