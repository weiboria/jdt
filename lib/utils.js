
/* {value:'{Object} a bc', data:'def'} ==> {type:Object, key:a, value:bc\ndef} *
 * ============================================================================*/

exports.formatKeyTypeValue = (function(){
	
	var reg = /(?:{(.*)}\s*)?(?:([^\s]*)\s*)?(.*)?/;
	
	return function(oData) {
		var value = oData.value
		  , snap  = value.match(reg)
		  , data  = {
			    key : ''
			  , value : value
			  , type : ''
			};
	
		if(snap && snap[1]) {
			data.type = snap[1];
			if(snap[2]) {
				data.key = snap[2];
			}
			data.value = snap[3] || '';
		}
		data.value = exports.formatDefault({
			 'value' : data.value
			,'data'  : oData.data
		});
		return data;
	}
})();

/* {value:123, data:456} ==> 123456 *
 * ================================ */

exports.formatDefault = function(oData){
	return (oData.value + "\n" + oData.data).trim();
};

/* {value:123,456 789, data:abc def} ==> [123,456,789,abc,def] *
 * =========================================================== */

exports.formatList = function(oData) {
	var data = [oData.value, oData.data].join("\n")
		data = data.trim().replace(/([\s,]+)/g, " ");
		data = data.split(" ");
	return data
};

/* 
 * var ret = {};
 * extend( ret, {a:1,b:2}, {c:3, d:4}) ==> ret={a:1,b:2,c:3,d:4} *
 * ============================================================= */
exports.extend = (function(){
	function extend( target, source ) {
		for ( var key in source ) {
			var value = source[ key ];

			if ( source.hasOwnProperty( key ) 
			     && typeof value != 'undefined'
			     && value !== null
			) {
				target[ key ] = value;
			}
		}
	}
	return function ( target ) {
		var idx = 1;
		while ( arguments[ idx ] ) {
			extend( target, arguments[ idx ] );
			idx++;
		}
	};
})();
