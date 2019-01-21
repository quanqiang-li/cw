(function($) {
	window.orgName = "";
	window.orgCode = "";
	window.product = $.fn.product = {
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
						$("#list").on("click","dl",function(){
							$(this).find(".spantip").show();
							$(this).siblings().find(".spantip").hide();
							orgName = $(this).find("dd").text();
							orgCode = $(this).find("dd").attr("data-code");
						})
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
		/*新建产品第一步*/
		createProduct:function(){
			$.ajax({
				url: "/product/createProductStepOne",
				type: "post",
				data:{
					orgCode: orgCode,
					orgName: orgName,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						var id = data.dataBody.productId;
						//前往下一步
						location.href = "productRegion.html?id="+id;
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
	}
	
})(jQuery);

$(document).ready(function($){
	product.getList(1);
	$("#add").on("click",function(){
		location.href="addsysAdmin.html";
	})
})