/**
 * 解析方法集合
 * @id filter
 */

var path         = require("path")
  , fs           = require("fs")
  , format       = require("./format")
  , stack        = require("./stack")
  , walk         = require('./walk')
  , basename     = path.basename
  , extname      = path.extname
  , join         = path.join
  , readFileSync = fs.readFileSync
  , rBom         = /^\xef\xbb\xbf/
  , trimReg      = /^\/\*+\s*|\s*\*+\/$/gm;

/**
 * 解析注释行
 * @method filter.line
 * @public
 * @param {String} *sBlock 注释块代码
 * @param {oArgs}  oArgs   配置参数
 */

exports.line = function( sLine, sData ){
	var data = format.tag({
		value : sLine,
		data  : sData
	});
	return data;
};

/**
 * 解析注释块
 * @method filter.block
 * @public
 * @param {String} *sBlock 注释块代码
 * @param {oArgs}  oArgs   配置参数
 */

exports.block = function( sBlock, oArgs ){
	var lines = sBlock.replace(trimReg, '').split( "\n" )
	  , ret   = stack( oArgs && oArgs.config || {} )
	  , data  = {}
	  , other = [];
	
	lines.reverse().forEach(function( line ){
		var data = exports.line(line);
		
		if(data.tag){
			data.data = other.reverse().join("\n").trim();
			ret.add(data);
			other = [];
			return;
		}
		other.push(data.value);
	});
	
	ret.add(exports.line('',other.reverse().join("\n")));
	
	oArgs.format && (ret.data = oArgs.format(ret.data));
	oArgs.render && (ret.data = oArgs.render(ret.data));
	return ret.data
};


/**
 * 文件代码解析
 * @method filter.code
 * @public
 * @param {String} *sCode 文件代码
 * @param {Object} oArgs  解析配置
 */

exports.code = function( sCode, oArgs ){
	
	sCode = sCode.replace( rBom, '' ).replace( /\r/g, '' );
	
	var reg      = /\/\*{2}((.|\n)*?)\*+\//gim
	  , res      = []
	  , data
	  , block;
	
	while( block = reg.exec( sCode ) ){
        var data = exports.block(
        	block[1].trim()
          , oArgs
		);
		res.push( data )
	}
	return res;
};

/**
 * 根据资源路径批量解析注释
 * @method filter.uri
 * @public
 * @param {String} *sUri 资源路径
 * @param {Object} oArgs 解析配置
 */

exports.uri = function( sUri, oArgs ){
	var extname = oArgs && oArgs.extname || ".js"
	  , filter  = oArgs && oArgs.filter
      , res     = walk( sUri, filter )[ extname ]
	  , files   = ( res || [] ).sort()
	  , list    = {};
	  
	files.forEach(function( uri ){
		
		var code = readFileSync( uri, 'utf8' );
		
		list[uri] = exports.code( code, oArgs );
	});
	return list;
};