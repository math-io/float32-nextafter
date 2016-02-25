'use strict';

var PINF = require( 'const-pinf-float32' );
var NINF = require( 'const-ninf-float32' );
var toFloat32 = require( 'float64-to-float32' );
var nextafterf = require( './../lib' );

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
