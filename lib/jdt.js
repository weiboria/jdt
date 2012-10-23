/**
 * javascript document tool
 * @author liusong@staff.sina.com.cn
 * @Copyright © 1996-2012 weibo.com
 * @id jdt
 * @param {String}   sUri
 * @param {Function} fFilter
 */

var stack        = require('./stack')
  , walk         = require('./walk')
  , path         = require('path')
  , fs           = require('fs')
  , basename     = path.basename
  , dirname      = path.dirname
  , extname      = path.extname
  , join         = path.join
  , readFileSync = fs.readFileSync
  , rBom         = /^\xef\xbb\xbf/
  , rLine        = /^\s*\*+/gm
  , rTag         = /(?:@(\w+)\s*)?(.*)/;

/* filter .svn _svn *
 * ================ */
exports.filter = function(){
    return !(/^\.|_/.test(basename(sUri)));
}

/* exports: parseContent
 * ===================== */

exports.parseTagLine = function(sLine, sData){
	var data = { tag: '', value: sLine, data: sData}
	  , snap = sLine.match(rTag);
	  
	if(snap && snap[1]){
		data.tag   = snap[1];
		data.value = snap[2] || '';
	}
	return data;
};

exports.parseComment = function( sComment, oArgs ){
	var lines = sComment.split( "\n" ).reverse()
	  , ret   = stack( oArgs.config )
	  , data  = {}
	  , other = [];
	
	lines.forEach(function( line ){
		var trimLine;
		
		line = line.replace(rLine, '');		
		if( ( trimLine = line.trim() ).charAt( 0 ) === "@" ){
			var data = exports.parseTagLine(
				trimLine
			  , other.reverse().join("\n")
			);
			ret.add(data);
			other = [];
			return;
		}
		other.push( line );
	});
	return ret.data
};

/* exports: parseComments *
 * ====================== */

exports.parseComments = function( sCode, oArgs ){
	
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

/* exports: parseUri *
 * ================= */

exports.parseUri = function( sUri, oArgs ){
    var filter = oArgs.filter || exports.filter
      , res    = walk.uri( sUri, filter )[".js"]||[]
	  , files  = res.sort()
	  , list   = {};
	
	files.forEach(function( uri ){
		var code = readFileSync( uri, 'utf8' );
		
		list[uri] = exports.parseComments( code, oArgs );
	});
	return list;
};



/* Module Exports *
 * ============== */

module.exports = function( sUri, oArgs ){
	return exports.parseUri( sUri, oArgs )
};
