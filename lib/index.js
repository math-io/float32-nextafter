'use strict';

// MODULES //

var toWord = require( 'math-float32-to-word' );
var fromWord = require( 'math-float32-from-word' );
var toFloat32 = require( 'float64-to-float32' );
var SMALLEST_SUBNORMAL = require( 'const-smallest-float32' ).DENORMALIZED;


// VARIABLES //

// +infinity => exponent all 1s => 0 11111111 00000000000000000000000 => 2139095040
var INF_EXP_MASK = 0x7f800000;

// min normal biased exponent = -127 => 0 00000001 00000000000000000000000 => 8388608
var MIN_NORMAL_EXP_MASK = 0x00800000;


// NEXTAFTERF //

/**
* FUNCTION: nextafterf( x, y )
*	Returns the next representable single-precision floating-point number after `x` toward `y`.
*
* @param {Number} x - "from" input value
* @param {Number} y - "to" input value
* @returns {Number} next representable single-precision floating-point number
*/
function nextafterf( x, y ) {
	var wx;
	var w;

	// Special case: NaNs
	if ( x !== x || y !== y ) {
		return NaN;
	}
	// Special case: x == y
	if ( x === y ) {
		// Return `y` to ensure consistent behavior around zero => nextafterf( -0.0, +0.0 ) = +0.0, nextafterf( +0.0, -0.0 ) = -0.0
		return y;
	}
	if ( x === 0 ) {
		if ( y < 0 ) {
			x = -SMALLEST_SUBNORMAL;
		} else {
			x = SMALLEST_SUBNORMAL;
		}
		y = x * x; // raise underflow/inexact flags
		return x;
	}
	wx = toWord( x );

	// |y| > |x| => x += ulp
	if ( (y > x) === (x > 0) ) {
		wx += 1;
	}
	// |x| > |y| => x -= ulp
	else {
		wx -= 1;
	}
	// Check for overflow (i.e., an exponent of all 1s => +-infinity):
	w = wx & INF_EXP_MASK; // keep only exponent bits
	if ( w === INF_EXP_MASK ) {
		return toFloat32( x + x ); // raise overflow/inexact flags and return +-infinity
	}
	// Check for underflow (i.e., an exponent of all 0s):
	if ( w < MIN_NORMAL_EXP_MASK ) {
		y = x * x; // raise underflow/inexact flags
	}
	return fromWord( wx );
} // end FUNCTION nextafterf()


// EXPORTS //

module.exports = nextafterf;
