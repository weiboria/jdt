var utils = require("./utils");

/* Default Config *
 * ============== */

var defaultConfig = {
	'config' : {
		 'parent': ['param','return']
		,'merge' : true
		,'format': utils.formatKeyTypeValue
	},
	'param'  : {
		 'parent': 'event'
		,'merge' : true
		,'format': utils.formatKeyTypeValue
	},
	'enum'   : {
		 'parent': 'config'
		,'merge' : true
		,'format': utils.formatKeyTypeValue
	},
	'import' : {
		 'merge' : true
		,'format': utils.formatList
	},
	'link'   : {
		 'merge' : true
		,'format': utils.formatList
	},
	'author' : {
		 'merge' : true
		,'format': utils.formatList
	},
	'event'  : {
		 'merge' : true
		,'format': utils.formatKeyTypeValue
	},
	'history': {
		 'merge' : true
		,'format': utils.formatList
	},
	'return' : {
		 'format': utils.formatKeyTypeValue
	}
};

/* stack *
 * ===== */

var stack = function(config){
	var $ = this;
	
	$.data   = {};
	$.map    = {};
	$.config = {};
	
	utils.extend($.config, defaultConfig, config);

	for( var k in $.config ){
		var parent = $.config[k].parent || [];
		
		if( !Array.isArray(parent) ){
			parent = [parent]
		}
		
		parent.forEach(function(parent){
			$.merge(parent, $.map, k)
		});
	}
};

/* public add *
 * ========== */

stack.prototype.add = function(oData){
	var $      = this
	  , tag    = oData.tag
	  , config = $.config[tag] || {}
	  , format = config.format || utils.formatDefault
	  , parent;
	
	format && (oData = format(oData));
	  
	if( config.merge ){
		$.merge(tag, $.data, oData);
	}else{
		$.data[tag] = oData;
	}
	
	$.map[tag] && $.map[tag].forEach(function(tag){
		$.godown(tag, oData)
	});
	
	delete oData.tag;
};

/* public merge *
 * ============ */

stack.prototype.merge = function(sKey, oStack, oData){
	!oStack[sKey] && (oStack[sKey] = []);
	 oStack[sKey] = oStack[sKey].concat(oData);
};

/* public godown *
 * ============= */
stack.prototype.godown = function(sKey, oData){
	if( this.data[sKey] ) {
		oData[sKey] = this.data[sKey];
	}
};

module.exports = function(oConfig){
	return new stack( oConfig );
};