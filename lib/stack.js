var extend = require("./extend")
  , format = require("./format");

/* stack *
 * ===== */

var stack = function(config){
	var $ = this;
	
	$.data    = {};
	$.config  = {};
	$.mapping = {};

	
	extend($.config, config);

	for(var tag in $.config ){
		var parent = [].concat( $.config[tag].parent || [] )
		  , alias  = $.config[tag].alias  || tag;
		
		parent.forEach(function(parent){
			if($.config[parent] && $.config[parent].alias){
				parent = $.config[parent].alias
			}
			$.merge(parent, $.mapping, alias)
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
	  , render = config.render
	  , parent;
	
	if( method ){
		oData = method(oData)
	}else if( !$.mapping[tag] ){
		oData = format.value(oData).value;
	}
	
	$.mapping[tag] && $.mapping[tag].forEach(function(tag){
		$.append(tag, oData)
	});

	if(render){
		oData = render(oData);
	}

	if( config.merge ){
		$.merge(alias, $.data, oData);
	}else{
		$.data[alias] = oData;
	}

	oData.tag && delete oData.tag;
};

/* public merge *
 * ============ */

stack.prototype.merge = function(sKey, oStack, oData){
	!oStack[sKey] && (oStack[sKey] = []);
	 oStack[sKey] = [].concat(oData).concat(oStack[sKey]);
};

/* public append *
 * ============= */

stack.prototype.append = function(sKey, oData){
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