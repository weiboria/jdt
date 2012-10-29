/**
 * JDT (Javascript Document Tool)
 * =================================
 * @author liusong@staff.sina.com.cn
 * @Copyright © 1996-2012 weibo.com
 * @id jdt
 * @param  {String}   sUri    资源路径
 * @param  {Object}   oArgs   配置参数
 * @config {Object}   config  对注释tag的配置
 * @config {String}   extname 对提取文件后缀进行配置
 * @config {Function} filter  路径过滤函数，返回true|false用以决定是否保处理该路径
 */

var stack        = require('./stack')
  , walk         = require('./walk')
  , path         = require('path')
  , fs           = require('fs')
  , basename     = path.basename
  , extname      = path.extname
  , join         = path.join
  , readFileSync = fs.readFileSync
  , rBom         = /^\xef\xbb\xbf/
  , rLine        = /^\s*\*+/gm;

/* Module Exports *
 * ============== */

module.exports = exports = function( sUri, oArgs ){
	return exports.parseUri( sUri, oArgs )
};

/* Format Utils *
 * ============ */

exports.format = require("./format");


/* filter .svn _svn *
 * ================ */
exports.filter = function(){
    return !(/^\.|_/.test(basename(sUri)));
}

/* parseCommentLine *
 * ================ */

exports.parseCommentLine = function(sLine, sData){
	var data = exports.format.tag({
		value : sLine,
		data  : sData
	});
	return data;
};

/* parseComment *
 * ============ */

exports.parseComment = function( sComment, oArgs ){
	var lines = sComment.split( "\n" ).reverse()
	  , ret   = stack( oArgs.config )
	  , data  = {}
	  , other = [];
	
	lines.forEach(function( line ){
		var trimLine;
		
		line = line.replace(rLine, '');		
		if( ( trimLine = line.trim() ).charAt( 0 ) === "@" ){
			var data = exports.parseCommentLine(
				trimLine
			  , other.reverse().join("\n")
			);
			ret.add(data);
			other = [];
			return;
		}
		other.push( line );
	});
	
	ret.add(exports.parseCommentLine('',other.reverse().join("\n")));
	return ret.data
};

/* parseCode *
 * ========= */

exports.parseCode = function( sCode, oArgs ){
	
	sCode = sCode.replace( rBom, '' ).replace( /\r/g, '' );
	
	var reg      = /\/\*{2}((.|\n)*?)\*+\//gim
	  , res      = []
	  , data
	  , comment;
	
	while( comment = reg.exec( sCode ) ){
        var data = exports.parseComment(
        	comment[1].trim()
          , oArgs
		);
		res.push( data )
	}
	return res;
};

/* parseUri *
 * ======== */

exports.parseUri = function( sUri, oArgs ){
    var filter = oArgs.filter || exports.filter
      , res    = walk.uri( sUri, filter )[ oArgs.extname || ".js" ]||[]
	  , files  = res.sort()
	  , list   = {};
	
	files.forEach(function( uri ){
		var code = readFileSync( uri, 'utf8' );
		
		list[uri] = exports.parseCode( code, oArgs );
	});
	return list;
};