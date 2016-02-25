nextafterf
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Returns the next representable [single-precision floating-point number][ieee754] after `x` toward `y`.


## Installation

``` bash
$ npm install math-float32-nextafter
```


## Usage

``` javascript
var nextafterf = require( 'math-float32-nextafter' );
```

#### nextafterf( x, y )

Returns the next representable [single-precision floating-point number][ieee754] after `x` toward `y`.

``` javascript
var z = nextafterf( 1, 100 )
// returns 1.0000001192092896

z = nextafterf( 1, 0 );
// returns 0.9999999403953552

z = nextafterf( -8388608, -1e38 );
// returns -8388609
```

If `x` equals `y`, the `function` returns `y`, ensuring consistent behavior around zero.

``` javascript
var z = nextafterf( +0.0, -0.0 );
// returns -0.0

z = nextafterf( -0.0, +0.0 );
// returns +0.0
```

If either `x` or `y` is `NaN`, the `function` returns `NaN`.

``` javascript
var z = nextafterf( NaN, 5.0 );
// returns NaN

z = nextafterf( 5.0, NaN );
// returns NaN

z = nextafterf( NaN, NaN );
// returns NaN
```


## Examples

``` javascript
var PINF = require( 'const-pinf-float32' );
var NINF = require( 'const-ninf-float32' );
var toFloat32 = require( 'float64-to-float32' );
var nextafterf = require( 'math-float32-nextafter' );

var x;
var y;
var z;
var i;

for ( i = 0; i < 100; i++ ) {
	x = Math.random()*1e6 - 5e5;
	x = toFloat32( x );
	if ( Math.random() < 0.5 ) {
		y = NINF;
	} else {
		y = PINF;
	}
	z = nextafterf( x, y );
	console.log( 'x = %d, y = %d. nextafterf(x,y) => %d', x, y, z );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. The [Compute.io][compute-io] Authors.


[npm-image]: http://img.shields.io/npm/v/math-float32-nextafter.svg
[npm-url]: https://npmjs.org/package/math-float32-nextafter

[build-image]: http://img.shields.io/travis/math-io/float32-nextafter/master.svg
[build-url]: https://travis-ci.org/math-io/float32-nextafter

[coverage-image]: https://img.shields.io/codecov/c/github/math-io/float32-nextafter/master.svg
[coverage-url]: https://codecov.io/github/math-io/float32-nextafter?branch=master

[dependencies-image]: http://img.shields.io/david/math-io/float32-nextafter.svg
[dependencies-url]: https://david-dm.org/math-io/float32-nextafter

[dev-dependencies-image]: http://img.shields.io/david/dev/math-io/float32-nextafter.svg
[dev-dependencies-url]: https://david-dm.org/dev/math-io/float32-nextafter

[github-issues-image]: http://img.shields.io/github/issues/math-io/float32-nextafter.svg
[github-issues-url]: https://github.com/math-io/float32-nextafter/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[compute-io]: https://github.com/compute-io/
[ieee754]: https://en.wikipedia.org/wiki/IEEE_754-1985
