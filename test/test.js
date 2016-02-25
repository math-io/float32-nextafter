'use strict';

// MODULES //

var tape = require( 'tape' );
var toFloat32 = require( 'float64-to-float32' );
var PINF = require( 'const-pinf-float32' );
var NINF = require( 'const-ninf-float32' );
var SMALLEST_SUBNORMAL = require( 'const-smallest-float32' ).DENORMALIZED;
var SMALLEST_FLOAT32 = require( 'const-smallest-float32' ).VALUE;
var MAX_FLOAT32 = require( 'const-max-float32' );
var fromBits = require( 'math-float32-from-bits' );
var repeat = require( 'utils-repeat-string' );
var nextafterf = require( './../lib' );


// FIXTURES //

var normal = require( './fixtures/normal.json' );
var negativeSubnormal = require( './fixtures/negative_subnormal.json' );
var positiveSubnormal = require( './fixtures/positive_subnormal.json' );
var negativeVeryLarge = require( './fixtures/negative_very_large.json' );
var positiveVeryLarge = require( './fixtures/positive_very_large.json' );
var positiveLarge = require( './fixtures/positive_large.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof nextafterf, 'function', 'main export is a function' );
	t.end();
});

tape( 'if `x` is `NaN`, the function returns `NaN`', function test( t ) {
	var z = nextafterf( NaN, 5.0 );
	t.ok( z !== z, 'returns NaN' );
	t.end();
});

tape( 'if `y` is `NaN`, the function returns `NaN`', function test( t ) {
	var z = nextafterf( 5.0, NaN );
	t.ok( z !== z, 'returns NaN' );
	t.end();
});

tape( 'if `x` equals `y`, the function returns `y`', function test( t ) {
	var z;

	z = nextafterf( 1.0, 1.0 );
	t.equal( z, 1.0, 'returns 1.0' );

	z = nextafterf( -0.0, +0.0 );
	t.equal( z, 0, 'returns 0' );
	t.equal( 1/z, PINF, 'returns +0' );

	z = nextafterf( +0.0, -0.0 );
	t.equal( z, 0, 'returns 0' );
	t.equal( 1/z, NINF, 'returns -0' );

	t.end();
});

tape( 'if `x` is `0` and `y` is positive, the function returns the minimum positive subnormal number', function test( t ) {
	var z = nextafterf( 0.0, 1.0 );
	t.equal( z, SMALLEST_SUBNORMAL, 'returns min positive subnormal' );
	t.end();
});

tape( 'if `x` is `0` and `y` is negative, the function returns the minimum negative subnormal number', function test( t ) {
	var z = nextafterf( 0.0, -1.0 );
	t.equal( z, -SMALLEST_SUBNORMAL, 'returns min negative subnormal' );
	t.end();
});

tape( 'if `x` is the maximum positive float and `y` is `+infinity`, the function overflows and returns `+infinity`', function test( t ) {
	var z = nextafterf( MAX_FLOAT32, PINF );
	t.equal( z, PINF, 'returns +infinity' );
	t.end();
});

tape( 'if `x` is the maximum negative float and `y` is `-infinity`, the function overflows and returns `-infinity`', function test( t ) {
	var z = nextafterf( -MAX_FLOAT32, NINF );
	t.equal( z, NINF, 'returns -infinity' );
	t.end();
});

tape( 'if `x` is the minimum positive normal float and `y < x`, the function returns the largest subnormal float', function test( t ) {
	var expected;
	var sign;
	var frac;
	var exp;
	var z;


	sign = '0';
	exp = repeat( '0', 8 );
	frac = repeat( '1', 23 );

	expected = fromBits( sign+exp+frac );
	z = nextafterf( SMALLEST_FLOAT32, 0 );

	t.equal( z, expected, 'returns largest subnormal' );
	t.end();
});

tape( 'if `x` is the minimum negative normal float and `y > x`, the function returns the largest subnormal float', function test( t ) {
	var expected;
	var sign;
	var frac;
	var exp;
	var z;


	sign = '1';
	exp = repeat( '0', 8 );
	frac = repeat( '1', 23 );

	expected = fromBits( sign+exp+frac );
	z = nextafterf( -SMALLEST_FLOAT32, 0 );

	t.equal( z, expected, 'returns largest subnormal' );
	t.end();
});

tape( 'if `x` is the maximum positive subnormal float and `y > x`, the function returns the smallest positive normal float', function test( t ) {
	var expected;
	var sign;
	var frac;
	var exp;
	var x;
	var z;


	sign = '0';
	exp = repeat( '0', 8 );
	frac = repeat( '1', 23 );

	x = fromBits( sign+exp+frac );
	expected = SMALLEST_FLOAT32;

	z = nextafterf( x, 1 );

	t.equal( z, expected, 'returns minimum normal' );
	t.end();
});

tape( 'if `x` is the maximum negative subnormal float and `y < x`, the function returns the smallest negative subnormal float', function test( t ) {
	var expected;
	var sign;
	var frac;
	var exp;
	var x;
	var z;


	sign = '1';
	exp = repeat( '0', 8 );
	frac = repeat( '1', 23 );

	x = fromBits( sign+exp+frac );
	expected = -SMALLEST_FLOAT32;

	z = nextafterf( x, -1 );

	t.equal( z, expected, 'returns minimum normal' );
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = normal.x;
	y = normal.y;
	expected = normal.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number (negative subnormal)', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = negativeSubnormal.x;
	y = negativeSubnormal.y;
	expected = negativeSubnormal.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number (positive subnormal)', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = positiveSubnormal.x;
	y = positiveSubnormal.y;
	expected = positiveSubnormal.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number (negative very large)', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = negativeVeryLarge.x;
	y = negativeVeryLarge.y;
	expected = negativeVeryLarge.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number (positive very large)', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = positiveVeryLarge.x;
	y = positiveVeryLarge.y;
	expected = positiveVeryLarge.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});

tape( 'the function returns the next representable single-precision floating-point number (positive large)', function test( t ) {
	var expected;
	var xf;
	var ef;
	var x;
	var y;
	var z;
	var i;

	x = positiveLarge.x;
	y = positiveLarge.y;
	expected = positiveLarge.expected;

	for ( i = 0; i < x.length; i++ ) {
		xf = toFloat32( x[i] );
		z = nextafterf( xf, y[i] );
		ef = toFloat32( expected[i] );
		t.equal( z, ef, 'returns '+ef+' when provided '+xf+' and '+y[i] );
	}
	t.end();
});
