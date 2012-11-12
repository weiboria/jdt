/**
 * 格式化方法扩展
 * @id format
 */

/**
 * tag格式化方法
 * @method format.tag
 * @public
 * {value:"@param {object} aaa bbb", data:"ccc"}
 * 
 * // {tag:"param", value:"{object} aaa bbb", data:"ccc"} *
 */

exports.tag = (function(){
	var reg  = /^(\s*\*+)/;
	var reg1 = /^(?:\s*(@\w*)(\s+|$))/;
	return function(oData){
		oData.tag   = '';
		oData.data  = oData.data || '';
		oData.value = oData.value.replace(reg, '');
		oData.value = oData.value.replace(reg1, function(match, tag){
			tag && (oData.tag = tag.slice(1));
			return '';
		});
		
		return oData;
	}
})();

/**
 * {type}格式化方法
 * @method format.type
 * @public
 * @example
 * jdt.format.type({value:"{object} aaa bbb", data:"ccc"});
 * 
 * // {type:"Object", value:"aaa bbb", data:"ccc"} *
 */

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

/**
 * key 格式化方法
 * @method format.key
 * @public
 * @example
 * jdt.format.key({value:"aaa bbb", data:"ccc"});
 * 
 * //{key:"aaa", value:"bbb", data:"ccc"}
 */

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

/**
 * value 格式化方法
 * @method format.value
 * @public
 * @example
 * jdt.format.value({value:"bbb", data:"ccc"});
 * 
 * //{value: "bbb\nccc"}
 */

exports.value = function(oData){
	oData.value = (oData.value + "\n" + oData.data).trim();
	delete oData.data;
	return oData;
};

/**
 * key value 格式化方法
 * @method format.keyValue
 * @public
 * @example
 * jdt.format.keyValue({value:"aaa bbb", data:"ccc"});
 * 
 * // {key:"aaa", value: "bbb\nccc"}
 */

exports.keyValue = function(oData){
	oData = exports.key(oData);
	oData = exports.value(oData);
	return oData;
};

/**
 * {type} key value 格式化方法
 * @method format.typeKeyValue
 * @public
 * @example
 * jdt.format.typeKeyValue({value:'{Object} aaa bbb', data:'ccc'});
 * 
 * // {type:"Object", key:"aaa", value:"bbb\nccc"}
 */

exports.typeKeyValue = function(oData) {
	oData = exports.type(oData);
	oData = exports.keyValue(oData);
	return oData;
}

/**
 * list 格式化方法
 * @method format.list
 * @public
 * @example
 * jdt.format.list({value:123 456 789, data:abc\ndef});
 * 
 * // ["123 456 789","abc","def"]
 */

exports.list = function(oData) {
	var data = [oData.value, oData.data].join("\n").trim();
		data = data.replace(/(\s*\n\s*)/,'\n')
		data = data.split("\n");
	return data
};

exports.escape = function(sString){
	sString = sString.replace(/&(?!\w+;)/g, '&amp;')
		    .replace(/</g, '&lt;')
		    .replace(/>/g, '&gt;')
		    .replace(/"/g, '&quot;');
	return sString;
}
