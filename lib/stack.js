var extend = require("./extend")
  , format  = require("./format");

/* stack *
 * ===== */

var stack = function(config){
	var $ = this;
	
	$.data   = {};
	$.map    = {};
	$.config = {};
	
	extend($.config, config);

	for(var tag in $.config ){
		var parent = [].concat( $.config[tag].parent || [] )
		  , alias  = $.config[tag].alias  || tag;
		
		parent.forEach(function(parent){
			if($.config[parent] && $.config[parent].alias){
				parent = $.config[parent].alias
			}
			$.merge(parent, $.map, alias)
		});
	}
};

/* public add *
 * ========== */

stack.prototype.add = function(oData){
	var $      = this
	  , tag    = oData.tag
	  , config = $.config[tag] || {}
	  , alias  = config.alias  || tag
	  , method = config.format
	  , parent;
	
	if( method ){
		oData = method(oData)
	}else if( !$.map[tag] ){
		oData = format.value(oData).value;
	}
	
	if( config.merge ){
		$.merge(alias, $.data, oData);
	}else{
		$.data[alias] = oData;
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
	 oStack[sKey] = [].concat(oData).concat(oStack[sKey]);
};

/* public godown *
 * ============= */
stack.prototype.godown = function(sKey, oData){
	if( this.data[sKey] ) {
		oData[sKey] = this.data[sKey];
		delete this.data[sKey];
	}
};

/* Module Exports *
 * ============== */
module.exports = function(oConfig){
	return new stack( oConfig );
};