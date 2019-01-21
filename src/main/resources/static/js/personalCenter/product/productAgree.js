(function($) {
	window.product = $.fn.product = {
		/*获取产品列表*/
		getList:function(){
			$.ajax({
				url: "/product/getProductByKey",
				type: "get",
				data: {
					id : util.request("id"),
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var productList = data.dataBody.product;
						editor.txt.html(productList.elementThree);
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
		/*新建产品基本信息*/
		updateProduct:function(type){
			$.ajax({
				url: "/product/updateProduct",
				type: "post",
				data:{
					id:util.request("id"),
					elementThree:editor.txt.html(),
					statusCode: "OFFLINE",
					statusName: "下线",
				},
				dataType: "json",
				cache:false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						//前往下一步
						$.jBox.success("提交成功","提示");
						setTimeout(function(){
							location.href = "productDetail.html?id="+util.request("id");
						},1000)
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
		toNext : function(type){
			console.log(editor.txt.html())
			var text = editor.txt.html().replace(/<[^>]+>/g,"");
			if(text.length>0){
				product.updateProduct(type);
			}else{
				$.jBox.tip("请录入产品详情","提示");
			}
		},
	}
	
})(jQuery);

$(document).ready(function($){
	if(util.request("edit")){
		product.getList();
	}
})