JDT (Javascript Document Tool)
==============================

- [安装](#install)
- [如何开始](#quick_start)
- [参数](#parameters)
- [文件过滤](#filter)
- [指定@tag的合并](#merge)
- [指定@tag的父级](#parent)
- [指定@tag的别名](#alias)
- [自定义@tag的格式化方法](#format)

<a name="install"/>
### 安装

    $ npm install jdt

<a name="quick_start"/>
### 如何开始
jdt( `` sUri ``, `` [oArgs] ``);

    var jdt = require("jdt");
    jdt( '/data/data1/project/js');

<a name="parameters"/>
### 参数

#### sUri : String   必选参数，资源路径

    jdt("/data/data1/project/js")

#### oArgs : Object  非必选参数，配置参数

    jdt("/data/data1/project/js", {
    	//目录遍历会调用此方法进行过滤
    	//对参数uri进行检查如果保留则返回true
    	  "filter"  : function(uri){
    	  	...
    	  	return true;
    	  }
    	//配置文件的扩展名，默认为".js"
    	, "extname" : ".js"
    	//配置@tag标签的规则
    	, "config"  : {
    		"tag"  : 
    		{
    			//当前@tag的父级@tag名称，可以是字符串或数组
    			 "parent" : "tag",
    			//当前@tag如果出现多次是否合并为数组
    			//该值不为空时会将该注释块中所有相同父级的同名@tag合并为数组
    			//反之则结果则以字符串型式显示，如果同一注释块中有多个仅保留第一个
    			"meage"  : true,
    			//当前tag格式化函数，返回结果会显示为return的内容
    			//oData是一个Object包函有三个字段 {tag:tag, value:value, data:data }
    			//注意：如果return的内容是字符串类型，则指定parent为当前@tag的将无法成为其子集
    			"format" : function(oData){
    				var data = {};
    				...
    				return data;
    			}
    		},
    		"tag1" : 
    		{
    			...
    		}
    	}
    }

<a name="filter"/>
### 文件过滤

以过滤 .svn _svn为例

    var path = require("path")
      , basename = path.basename;
    
    jdt("/data/data1/project/js", {
    	filter : function(uri){
    	    var base = basename(uri);
    	    
    	    if(!(/^\.|_/.test(base))){
    	       return true;
    	    }
    	    return false;
    	}
    })

<a name="merge"/>
### 指定@tag的合并

通常在注释中会出现多个一样的@tag，如果对该@tag配置了`` merge=true ``那么该@tag将被合并成为一个数组。

如果没有配置merge参数，结果仅显示首个@tag中的内容

注释代码:

    /**
     * @import a.b.c
     * @import d.e.f
     * @import g.h.i
     */

js代码:

    jdt("/data/data1/project/js", {
    	config:{
    		"import":{
    			"merge" : true
    		}
    	}
    })

执行结果:

    {
    	"import": [
    		"a.b.c",
    		"d.e.f",
    		"g.h.i"
    	]
    }

<a name="parent"/>
### 指定@tag父级

我们以家庭为例，成员包括父亲、母亲、及孩子，而我们需要在节构上表明成员与家的关系就会用到`` parent ``这个配置.

注释代码:

    /**
     * @family a
     * @father d
     * @mother c
     * @child  d
     */

js代码:

    jdt("/data/data1/project/js", {
    	"config":{
    		"father":{
    			"parent" : "family"
    		},
    		"mother":{
    			"parent" : "family"
    		},
    		"child" :{
    			"parent" : "father"
    		}
    	}
    })

执行结果:

    {
    	"family": {
    		"value": "a",
    		"data": "",
    		"mother": "c",
    		"father": {
    			"value": "d",
    			"data" : "",
    			"child": "d"
    		}
    	}
    }

<a name="alias"/>
### 指定@tag别名

当我们需要给提取的@tag一个新的标签名称时，你会用到 `` alias `` 这个配置.

假设我们让提取的@import显示为@imports

注释代码:

    /**
     * @import a.b.c
     * @import d.e.f
     * @import g.h.i
     */

js代码:

    jdt("/data/data1/project/js", {
    	config:{
    		"import":{
    			"merge" : true,
    			"alias" : "imports"
    		}
    	}
    })

执行结果:

    {
    	"imports": [
    		"a.b.c",
    		"d.e.f",
    		"g.h.i"
    	]
    }

<a name="alias"/>
### 自定义@tag的格式化方法
