/**
 * JDT (Javascript Document Tool)
 * @id jdt
 * @param  {String}   sUri    资源路径
 * @param  {Object}   oArgs   配置参数
 * @config {Object}   config  对注释tag的配置
 * @config {String}   extname 对提取文件后缀进行配置
 * @config {Function} filter  路径过滤函数，返回true|false用以决定是否保处理该路径
 * @import format
 * @import filter
 * @author liusong@staff.sina.com.cn
 * @Copyright © 1996-2012 weibo.com 
 */

exports = function( sUri, oArgs ){
	return exports.filter.uri( sUri, oArgs || {} )
};

/* format *
 * ====== */

exports.format = require("./format");

/* parse *
 * ===== */

exports.filter  = require("./filter");

/* Module Exports *
 * ============== */

module.exports = exports;