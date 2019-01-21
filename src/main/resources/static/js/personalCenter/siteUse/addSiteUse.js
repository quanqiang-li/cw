(function($) {
	window.uuk = "",
	window.code = null,
	window.hxList = [],
	window.hxnameList = [],
	window.yxList = [],
	window.yxnameList = [],
	window.site = $.fn.site = {
		/*获取机构*/
		getSiteList:function(goPageNum,mobile){
			$.ajax({
				url: "/siteManage/getSiteList",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.siteList;
						$.each(list,function(i,item){
							if($.inArray(item.site.name, yxnameList) == -1){
								hxList.push({siteId:item.site.id, siteName:item.site.name});
							}
						})
						var source   = $("#hxlist-template").html();
						var template = Handlebars.compile(source);
						$("#hxzd").html(template(hxList));
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
		/*根据用户id解绑用户和其所有绑定金融机构*/
		detBranchList:function(id){
			$.ajax({
				url: "/financialOrgUser/untieAllRelationShipBetweenUserAndFinancialOrgByUserUuk",
				type: "post",
				data:{
					userUuk: uuk
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						yxList = [];
						yxnameList = [];
						var sourceYx   = $("#yxlist-template").html();
						var templateYx = Handlebars.compile(sourceYx);
						$("#yxjg").html(templateYx(yxList));
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
		/* 创建、修改用户机构 */
		createManager: function(id,type){
			if($("#mobile").val() == ""){
				$.jBox.tip ("请填写手机号码", "提示");
				return false;
			}
			if(uuk && type=="crt"){
				type = "upd";
			}
			$.ajax({
				url: "/siteManageUser/createOrUpdateSiteManageUser",
				type: "get",
				data: {
					mobile: $("#mobile").val(),
					siteId: id,
					userUuk: uuk,
					operateType: type
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						if(data.dataBody.uuk){
							uuk = data.dataBody.uuk;
						}
						var userData = JSON.parse(window.localStorage.getItem("financialOrgUserResultList")),
							siteDesc = "";
						if(type == "crt" || type == "upd"){
							$.each(hxList,function(i,item){
								if(item.siteId == id){
									hxList.splice(i,1);
									yxList.push(item);
									
									return false;
								}
							})
						}else{
							$.each(yxList,function(i,item){
								if(item.siteId == id){
									yxList.splice(i,1);
									hxList.push(item);
									return false;
								}
							})
						}
						var source   = $("#hxlist-template").html();
						var template = Handlebars.compile(source);
						$("#hxzd").html(template(hxList));
						var sourceYx   = $("#yxlist-template").html();
						var templateYx = Handlebars.compile(sourceYx);
						$("#yxzd").html(templateYx(yxList));
						/*if(type == "type"){
							$.jBox.success("新增机构用户成功","提示");
						}else{
							$.jBox.success("用户解绑机构用户成功","提示");
						}*/
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");	
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.error(data.errorString,"失败");
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
				
		},
	}
	
})(jQuery);

$(document).ready(function($){
	if(util.request("userId")){
		$("#titleTem").text("编辑站点用户");
			
		if(window.localStorage.getItem("financialOrgUserResultList")){
			var userData = JSON.parse(window.localStorage.getItem("financialOrgUserResultList"));
			branch = userData.siteDesc.split(',');
			$.each(branch,function(i,item){
				var arr = item.split(':');
				yxList.push({siteId:arr[0], siteName:arr[1]});
				yxnameList.push(arr[1]);
			})
			uuk = userData.uuk;
			code = userData.code;
			var sourceYx   = $("#yxlist-template").html();
			var templateYx = Handlebars.compile(sourceYx);
			$("#yxzd").html(templateYx(yxList));
		}
		$("#mobile").val(userData.mobile).attr("readonly","readonly");
			
	}
	site.getSiteList();
})