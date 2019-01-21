(function($) {
	window.institution = $.fn.institution = {
		/*获取机构列表*/
		getList:function(){
			$.ajax({
				url: "/financialOrg/getFinancialOrgList",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.financialOrgList;
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$.each(list,function(i,item){
							if(!item.logo){
								item.logo = "/static/img/guanliyuan.png";
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
		/*跳转分支机构列表*/
		tobranch:function(id,logo,name,code){
			var data = {name:name,logo:logo,code:code};
			window.localStorage.setItem("instInfo",JSON.stringify(data));
			location.href="branchIns.html?id="+id;
		}
	}
	
})(jQuery);

$(document).ready(function($){
	institution.getList(1);
	$("#add").on("click",function(){
		location.href="addsysAdmin.html";
	})
})