(function($) {
	window.roleList = [];
	window.authentication = $.fn.authentication = {
		//从字典表获取用户机构职位
	    getUserOrgTitleList:function(type){
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{"type":type},
				dataType: "json",
				async: false,
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.dictionaryList;
						roleList = list;
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			});
		},
		/*获取我的企业列表*/
		getList : function(goPageNum){
			$.ajax({
				url: "/user/getLoginInfo",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var loginInfo = JSON.parse(data.dataBody.loginInfo),
							orgInfoList = loginInfo.orgInfoList,
							user = loginInfo.currentOrg;
						$.each(orgInfoList,function(i,item){
							if(item.userOrgBind != "1"){
								item.orgBind = true;
								item.businessBind = false;
							}else{
								item.orgBind = false;
								item.businessBind = true;
							}
							$.each(roleList,function(v,val){
								if(item.userOrgTitle == val.value){
									item.position = val.optionText;
								}
							})
							
						})
						
						var source = $("#business-template").html();
						var template = Handlebars.compile(source);
						$("#business-list").html(template(orgInfoList));

						window.localStorage.setItem("userInfo",JSON.stringify(orgInfoList));
						window.localStorage.setItem("user",JSON.stringify(user));
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/*爱税宝认证*/
		getAsbBinding : function(){
			$.ajax({
				url: "/AsbBinding/asbPageAddress",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == 0){
						var openRealNameUrl = data.dataBody.asbPageAddress+"?tel=",
							backurl = window.location.href;
						//判断地址栏有没有id,有就截取id前的路径
						if(backurl.indexOf("?id")!= -1){
							backurl = backurl.slice(backurl,backurl.indexOf("?id"));	
						}else if(backurl.indexOf("&id")!= -1){
							backurl = backurl.slice(backurl,backurl.indexOf("&id"));
						}
						$.jBox.confirm ("点击确定将跳转到爱税宝实名认证页面！", "提示",function(v, h, f){
							if (v === 'ok') {
								location.href = openRealNameUrl + window.localStorage.getItem("tel") + "&url=" +backurl;
							}
						});
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/*爱税宝绑定*/
		asbBinding : function(id){		
			$.ajax({
				url:  "/AsbBinding/asbBinding",
				type: "get",
				data: {id : id},
				success : function(data){
					//console.log(data)
					if(data.errorCode == 0){
						authentication.getList(1);			
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{					
						$.jBox.error(data.errorString, "提示");
					}
				}
			})
		},
		//地址栏参数
		GetQueryString : function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if(r!=null)return  unescape(r[2]); return null;
		}
	}
	
})(jQuery);

$(document).ready(function($){
	authentication.getUserOrgTitleList("userOrgTitle");
	authentication.getList();
	if(authentication.GetQueryString("id")){
		authentication.asbBinding(authentication.GetQueryString("id"));
	}
	//authentication.getBusiness(JSON.parse(window.localStorage.getItem("userInfo")),1);
})