/**
 *  util 工具类
 */
var util = {
		
	/**
	 * 格式化日期
	 */
	formatDate: function(time, format) {
		if(time == "null" || time == null || time == '' || time == undefined) {
			return '';
		}
		
		var t = new Date(time);
	    var tf = function(i){return (i < 10 ? '0' : '') + i};
	    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
	        switch(a){
	            case 'yyyy':
	                return tf(t.getFullYear());
	                break;
	            case 'MM':
	                return tf(t.getMonth() + 1);
	                break;
	            case 'mm':
	                return tf(t.getMinutes());
	                break;
	            case 'dd':
	                return tf(t.getDate());
	                break;
	            case 'HH':
	                return tf(t.getHours());
	                break;
	            case 'ss':
	                return tf(t.getSeconds());
	                break;
	        }
	    });
	},
	
	/**
	 * 获得星期几
	 */
	getDayofWeek: function(day) {
		 
		 switch (day) { 
	         case 0:
	             day = "星期日";
	             break;
	         case 1:
	             day="星期一";
	             break;
	         case 2:
	             day = "星期二";
	             break;
	         case 3:
	             day = "星期三";
	             break;
	         case 4:
	             day = "星期四";
	             break;
	         case 5:
	             day = "星期五";
	             break;
	         case 6:
	             day = "星期六";
	             break;
		 }
		 
		return day;

	},
	
	/**
	 * 加减日期(天)
	 */
	addDay: function(days) {
		  var d=new Date(); 
	      d.setDate(d.getDate()+days); 
	      var m=d.getMonth()+1; 
	      return util.formatDate(d, 'yyyy-MM-dd');
	},
	
	/**
	 * 加减日期(月)
	 */
	addMonth: function(month) {
		  var d = new Date(); 
		  d.setMonth(d.getMonth()+ month);
	      var m=d.getMonth()+1; 
	      return util.formatDate(d, 'yyyy-MM-dd');
	},

	/**
	 * 判断日期，时间大小
	 * 
	 * @param {Object}
	 *            startDate 起始日期
	 * @param {Object}
	 *            endDate 截止日期
	 * @param {Object}
	 *            canEq 是否可以相等
	 * @return true||false
	 */
	compareDate: function(startDate, endDate, canEq) {
		var result = false;
		var allStartDate = null;
		var allStartDate = null;
		var startDateTemp = startDate.split(" ");
		var endDateTemp = endDate.split(" ");
		var arrStartDate = startDateTemp[0].split("-");
		var arrEndDate = endDateTemp[0].split("-");
		if (startDateTemp.length > 1 && endDateTemp.length > 1) {
			var arrStartTime = startDateTemp[1].split(":");
			var arrEndTime = endDateTemp[1].split(":");
			allStartDate = new Date(arrStartDate[0], parseInt(arrStartDate[1] - 1), arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
			allEndDate = new Date(arrEndDate[0], parseInt(arrEndDate[1] - 1), arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);
		} else {
			allStartDate = new Date(arrStartDate[0], parseInt(arrStartDate[1] - 1), arrStartDate[2]);
			allEndDate = new Date(arrEndDate[0], parseInt(arrEndDate[1] - 1), arrEndDate[2]);
		}
		if (canEq) {
			if (allStartDate.getTime() > allEndDate.getTime()) {
				result = false;
			} else {
				result = true;
			}
		} else {
			if (allStartDate.getTime() >= allEndDate.getTime()) {
				result = false;
			} else {
				result = true;
			}
		}
		return result;
	},
	
	/**
	 * 加入收藏夹
	 * @param siteUrl
	 * @param siteName
	 */
	joinFavorite: function(siteUrl, siteName){  
		//捕获加入收藏过程中的异常       
		try {       
			//判断浏览器是否支持document.all        
			if(document.all){                     
			//如果支持则用external方式加入收藏夹              
			  window.external.addFavorite(siteUrl,siteName);                
			 }else if(window.sidebar){                      
			  //如果支持window.sidebar，则用下列方式加入收藏夹  
			  window.sidebar.addPanel(siteName, siteUrl,'');         
			 } else {
				 alert("加入收藏夹失败，请使用Ctrl+D快捷键进行添加操作!");
			 }
		 }catch(e){          
			alert("加入收藏夹失败，请使用Ctrl+D快捷键进行添加操作!");   
		}
	},
	
	/**
	 * 取得url中的参数值
	 */
	request: function(paras) {
		var url = location.href;  
	    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	    var paraObj = {}; 
	   
	    for (var i=0; j=paraString[i]; i++){  
	        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	    }  
	    
	    var returnValue = paraObj[paras.toLowerCase()]; 
	    if(!returnValue) {
	    	return null;
	    }
	    if(returnValue.indexOf("#")>0) {
//		    	console.log("进来了");
	    	returnValue = returnValue.substring(0,returnValue.length-1);
	    }
	    if(typeof(returnValue)=="undefined"){  
	        return "";  
	    }else{  
	        return returnValue;  
	    } 
	},
	
	/**
	 * 判断元素是否为空
	 */
	empty: function(v) {
		
		if("null"===v) return true;
		if(null === v) return true; 
		
		switch (typeof v){ 
			case 'undefined' : return true; 
			case 'string' : if(v.trim().length == 0) return true; break; 
			case 'boolean' : if(!v) return true; break; 
			case 'number' : if(0 === v) return true; break; 
			case 'object' : 
			if(undefined !== v.length && v.length==0) return true; 
			for(var k in v){return false;} return true; 
			break; 
		} 
		return false; 
	},
	/**
	 * 判断元素是否为数字
	 */
	isNum: function(v,flag) {
		// 验证是否是数字
		if (util.empty(v)) {
			return false;
		}
		switch (flag) {
			case null: // 数字
			case "":
				return false;
			case "+": // 正数
				return /(^\+?|^\d?)\d*\.?\d+$/.test(v);
			case "-": // 负数
				return /^-\d*\.?\d+$/.test(v);
			case "i": // 整数
				return /(^-?|^\+?|\d)\d+$/.test(v);
			case "+i": // 正整数
				return /(^\d+$)|(^\+?\d+$)/.test(v);
			case "-i": // 负整数
				return /^[-]\d+$/.test(v);
			case "f": // 浮点数
				return /(^-?|\+?)\d+(\.\d+)?$/.test(v);
			case "+f": // 正浮点数
				return /(^\+?|^\d?)\d*\.\d+$/.test(v);
			case "-f": // 负浮点数
				return /^[-]\d*\.\d$/.test(v);
			default: // 缺省
				return true;
		}
	},
	
	post: function(url, data, async, success, error) {
		var setting = {
				url: url,
				data: data,
				async: async,
				succss: success,
				error: error
		};
		var _defaultSetting = {
				url: "",
				data: {},
				dataType: "json",
				type: "post",
				async: false,
				success: $.noop,
				error: function(data) {
					console.log(data);
					$.jBox.error("失败！");
				}
		};
		
		var option = $.extend(_defaultSetting, setting);
		
		$.ajax({
			url: option.url,
			data: option.url,
			dataType: "json",
			type: "post",
			async: option.async,
			success: option.success,
			error: option.error
		});
	},
	
	get: function(url, data, async, success, error) {
		var setting = {
				url: url,
				data: data,
				async: async,
				succss: success,
				error: error
		};
		var _defaultSetting = {
				url: "",
				data: {},
				dataType: "json",
				async: false,
				success: $.noop,
				error: function(data) {
					console.log(data);
					$.jBox.error("失败！");
				}
		};
		
		var option = $.extend(_defaultSetting, setting);
		
		$.ajax({
			url: option.url,
			data: option.url,
			dataType: "json",
			type: "get",
			async: option.async,
			success: option.success,
			error: option.error
		});
	},
	
	/**
	 * 数字（金钱）格式化
	 * @param s 要转化的数字
	 * @param n 保留小数位数
	 * @returns {String}
	 */
	fmoney: function(s, n) {   
	   n = n > 0 && n <= 20 ? n : 2;   
	   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	   var l = s.split(".")[0].split("").reverse(),   
	   r = s.split(".")[1];   
	   t = "";   
	   for(i = 0; i < l.length; i ++ )   
	   {   
	      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	   }   
	  // return t.split("").reverse().join("") + "." + r;   
	   return t.split("").reverse().join("");  
	},
	
	fmoney1: function(s, n) {   
		   n = n > 0 && n <= 20 ? n : 2;   
		   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
		   var l = s.split(".")[0].split("").reverse(),   
		   r = s.split(".")[1];   
		   t = "";   
		   for(i = 0; i < l.length; i ++ )   
		   {   
		      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
		   }   
		   return t.split("").reverse().join("") + "." + r;   
		  // return t.split("").reverse().join("");  
		} 
	
};

//通过给Function.prototype增加方法来使得该方法对所有函数可用
Function.prototype.method = function (name, func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
	}
	return this;
};

/**
 * 给String添加去除空格函数  
 * trim 去除字符串左右空格
 * ltrim 去除字符串左空格
 * rtrim 去除字符串右空格
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "");
};


//取整数
Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});

/**
 * 页面跳转
 * @param pageDir 要跳转的页面
 * @param elem 要传递的参数元素
 */
function redirectPage(pageDir, elem) {
	var value = $("input[name='" + elem + "']").eq(0).val();
	if(util.empty(value)) {
		window.location.href = pageDir
	} else {
		window.location.href = pageDir + "?s=" + encodeURI(encodeURI($("input[name='" + elem + "']").eq(0).val()));
	}
	
}

/** 兼容IE9的console.log*/
var console = console||{log:function(){return;}};

$(document).ajaxComplete(function(evt, request, settings){
   if(request&&request.responseText){
	   var first = request.responseText[0]
	   if("{"!=first){
		   return;
	   }
	   //console.log(request);
	   var result = JSON.parse(request.responseText);
	   if(result&&result.error&&"您没有足够的权限执行该操作!"==result.error){
		   alert("你的登陆会话已过期，请重新登录!");
		   window.location =basePath+"login.jsp"; 
	   }
   }
})