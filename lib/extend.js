/**
 * 对象继承方法
 * @id extend
 * @param {Object}    *oTarget 输出对像
 * @param {Arguments} ... 被继承对像
 * @example
 * var ret = {};
 * extend(
 * 	 ret
 * 	,{a:1,b:2}
 * 	,{c:3, d:4}
 * );
 * // ret={a:1,b:2,c:3,d:4}
 */

var extend = function( oTarget, oSource ){
	for(var key in oSource) {
		var value = oSource[ key ];

		if ( oSource.hasOwnProperty( key ) 
		     && typeof value != 'undefined'
		     && value !== null
		) {
			oTarget[ key ] = value;
		}
	}
}

module.exports = function ( oTarget ) {
	var i = 1;
	while ( arguments[ i ] ) {
		extend( oTarget, arguments[ i ] );
		i++;
	}
};