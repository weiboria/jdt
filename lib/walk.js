/**
 * walk dir
 * @author liusong@staff.sina.com.cn
 * @Copyright © 1996-2012 SINA
 * @id walk
 * @param {String} sUri
 * @param {Function} fFilter
 */

var path        = require('path')
  , fs          = require('fs')
  , basename    = path.basename
  , extname     = path.extname
  , join        = path.join
  , lstatSync   = fs.lstatSync
  , readdirSync = fs.readdirSync;

/* default filter
 * ============== */

var defaultFilter = function(sUri){
    return true;
};

/* walk
 * ==== */

var walk = function( sUri, oList, fFilter ){
	sUri = sUri.replace(/\\/g, "\/");

	var one = lstatSync(sUri);
	
    if( fFilter(sUri) ){
        if( one.isFile() ){
            var type = extname(sUri);
            !oList[type] && (oList[type] = []);
             oList[type].push(sUri);
             oList['all'].push(sUri);
        }
        if( one.isDirectory() ){
            readdirSync( sUri ).forEach(function(sPart){
                walk( join( sUri, sPart ), oList, fFilter )
            })
        }
    }
};

/* module
 * ====== */

module.exports = function( sUri, fFilter){
    var filter = fFilter || defaultFilter;
	var list = { all:[] };

	walk( sUri, list, filter );
	return list;
};
