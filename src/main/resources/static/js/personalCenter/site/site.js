(function($) {
	window.site = $.fn.site = {
		/*获取站点列表*/
		getList:function(){
			$.ajax({
				url: "/siteManage/getSiteList",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.siteList;
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$.each(list,function(i,item){
							if(!item.logo){
								item.logo = "/static/img/zhandian.png";
							}
						})
						
						$("#list").html(template(list));
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
		/*删除站点*/
		deleteSite:function(id){
			$.ajax({
				url: "/siteManage/deleteSingleSite",
				type: "post",
				data:{
					siteId: id
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						$.jBox.success("删除成功","提示");
						site.getList(util.request("id"));
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.error(data.errorString,"提示");
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/*跳转修改地区页面*/
		editSite:function(editId){
			location.href="../region.html?editSiteId="+editId;
		}
	}
	
})(jQuery);

$(document).ready(function($){
	site.getList(1);
	$("#addSite").on("click",function(){
		window.location.href="../region.html?addSiteId=add";
	})
})