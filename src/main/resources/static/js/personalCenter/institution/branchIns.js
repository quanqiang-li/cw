(function($) {
	window.logo = null;
	window.institution = $.fn.institution = {
		/*获取分支机构列表*/
		getList:function(id){
			$.ajax({
				url: "/financialOrg/getAllBranchFinancialOrg",
				type: "get",
				data:{
					orgId: id
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.branchFinancialOrgList;
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$.each(list,function(i,item){
							item.logo = window.logo;
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
		/*删除分支机构*/
		deleteBranch:function(id){
			$.ajax({
				url: "/financialOrg/deleteBranchFinancialOrg",
				type: "post",
				data:{
					branchOrgId: id
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						$.jBox.success("删除成功","提示");
						institution.getList(util.request("id"));
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
		editBranch:function(editId){
			location.href="../region.html?editBranchId="+editId+"&id="+util.request("id");
		}
	}
	
})(jQuery);

$(document).ready(function($){
	institution.getList(util.request("id"));
	if(window.localStorage.getItem("instInfo")){
		var instInfo = JSON.parse(window.localStorage.getItem("instInfo"));
		$("#logo-title").text(instInfo.name);
		$("#logo").attr("src",instInfo.logo);
		window.logo = instInfo.logo;
	}else{
		$("#logo").attr("src","/static/img/guanliyuan.png");
		window.logo = "/static/img/guanliyuan.png";
	}
	$("#add").on("click",function(){
		location.href="../region.html?addBranchId="+util.request("id");
	})
})