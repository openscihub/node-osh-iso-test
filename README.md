# Iso test

Test your isomorphic web app or framework.

## Installation

```
npm install osh-iso-test
```

## Usage

A file `test/test.js` that uses the
[mocha](http://visionmedia.github.io/mocha/) testing framework:

```js

var iso = require('osh-iso-test');

describe('app', function() {
  it('should work', function(done) {
    this.timeout(0);
    iso({
      basedir: __dirname + '/iso',
      port: 3333
    }, done);
  });
});
```

where the `test` directory looks like:

```
- test/
  - test.js
  - iso/
    - test1/
      - index.js
      - main.js
    - test2/
      - index.js
      - something.js
```


Each index file in each test directory of the `iso` folder should export
a single function that accepts an [express](http://expressjs.com) instance and
a callback. For example, `test/iso/test1/index.js` could be:


```js
var serveStatic = require('serve-static');

module.exports = function(app, done) {
  var test = this;

  app.get('/', function(req, res) {
    res.send(
      '<html><body>' +
      test.iso +                  // injects '<script src="/iso.js"></script>'
      test.script('/main.js') +   // injects '<script src="/test1/main.js"></script>'
      '</body></html>'
    );
  });
  app.use(serveStatic(__dirname));
  done();
};
```

Notice that we needed to lookup `this.route` to inject the correct path
to a script for the browser.

Including the `/iso.js` script exposes the `iso` object on the global scope
in the browser; the `main.js` script uses the `iso` object to report the
test result back to the test runner.


## `this`/`iso` properties

The following variables are accessible on the `this` object within the
exported function in a test's `index.js` file *and* on the global `iso`
object in the browser.

### name

The name of the test. It is simply the name of the directory in which
the `index.js` file is defined.

For example, in `test/iso/test1/index.js`, you get

```js
module.exports = function(app, done) {
  console.log(this.name); // test1
  done();
};
```


### route

Simply `this.name` prefixed with `'/'`.


## `this` properties

These are available in only the `index.js` function (i.e. the "server").

### script

A function to inject a script element with the proper path.
Every test is hosted under a route defined by the name of its containing
directory; it's annoying to have to manipulate `__dirname`.

For example, in `test/iso/test1/index.js`:

```js
this.script('/main.js'); // '<script src="/test1/main.js"></script>'
```

## `iso` properties

These are available in the browser only.

## `iso.report`

In the browser, call this function to report the status of your test
back to the runner. It takes a string as argument.

For example, a really useless `test/iso/test1/main.js`:

```js
iso.report('Success');
```

## License

MIT
