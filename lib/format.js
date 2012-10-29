/* {value:"@param {object} aaa bbb", data:"ccc"} ==> {tag:"param", value:"{object} aaa bbb", data:"ccc"} *
 * ===================================================================================================== */

exports.tag = (function(){
	var reg = /^(?:@(\w*)(\s+|$))/;
	return function(oData){
		oData.tag = '';
		oData.value = oData.value.replace(reg, function(match, tag){
			oData.tag = tag;
			return '';
		});
		
		return oData;
	}
})();

/* {value:"{object} aaa bbb", data:"ccc"} ==> {type:"Object", value:"aaa bbb", data:"ccc"} *
 * ======================================================================================= */

exports.type = (function(){
	var uReg = /function|enum|string|object|boolean|array|number|null|undefined/gim;
	var tReg = /^(?:{([^}]*)}\s*)/;
	return function(oData){
		oData.type = '';
		oData.value = oData.value.replace(tReg, function( match, type ){
	  		oData.type = type.replace(uReg, function(str){
				return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
			})
			return '';
		});
		return oData;
	};
})();

/* {value:"aaa bbb", data:"ccc" ==> {key:"aaa", value:"bbb", data:"ccc"} *
 * ===================================================================== */

exports.key = (function(){
	var reg = /^(?:(\*)?(\w*)(\s+|$))/;
	return function(oData){
		oData.key = '';
		oData.required = false;
		oData.value = oData.value.replace(reg, function( match, required, key ){
	  		oData.key = key;
	  		required && (oData.required = true);
			return '';
		});
		return oData;
	};
})();

/* {value:"bbb", data:"ccc"} ==> {value: "bbb\nccc"} *
 * ================================================= */

exports.value = function(oData){
	oData.value = (oData.value + "\n" + oData.data).trim();
	delete oData.data;
	return oData;
};

/* {value:"aaa bbb", data:"ccc"} ==> {key:"aaa", value: "bbb\nccc"} *
 * ================================================================ */

exports.keyValue = function(oData){
	oData = exports.key(oData);
	oData = exports.value(oData);
	return oData;
};

/* {value:'{Object} aaa bbb', data:'ccc'} ==> {type:"Object", key:"aaa", value:"bbb\nccc"} *
 * ========================================================================================*/

exports.typeKeyValue = function(oData) {
	oData = exports.type(oData);
	oData = exports.keyValue(oData);
	return oData;
}

/* {value:123,456 789, data:abc def} ==> [123,456,789,abc,def] *
 * =========================================================== */

exports.list = function(oData) {
	var data = [oData.value, oData.data].join("\n")
		data = data.trim().replace(/([\s,]+)/g, " ");
		data = data.split(" ");
	return data
};
