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
						productList.loanAmount = productList.loanAmount/10000;
						productList.productType = product.getDictionary("productType","产品类型",productList.productType);
						productList.productFlag = product.getDictionary("productFlag","产品标识",productList.productFlag);
						productList.templates = product.getTemplate(productList.riskId);
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$("#product").html(template(productList));
						$("#elementOne").html(productList.elementOne);
						$("#elementTwo").html(productList.elementTwo);
						$("#elementThree").html(productList.elementThree);
						if(productList.statusCode == "OFFLINE" || productList.statusCode == "SAVE"){
							$(".edit").show();
							$('input[name="status"]').bootstrapSwitch({  
						        onText:"上线",  
						        offText:"下线", 
						        state:false,
							    onSwitchChange:function(event,state){  
							        if(state==true){  
							        	product.updateProduct("ONLINE","上线");
							        }else{  
							        	product.updateProduct("OFFLINE","下线"); 
							        }  
							    } 
							})
						}else if(productList.statusCode == "ONLINE"){
							$(".edit").hide();
							$('input[name="status"]').bootstrapSwitch({  
						        onText:"上线",  
						        offText:"下线", 
						        state:true,
							    onSwitchChange:function(event,state){  
							        if(state==true){  
							        	product.updateProduct("ONLINE","上线");
							        }else{  
							        	product.updateProduct("OFFLINE","下线"); 
							        }  
							    } 
							})
						}
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
		//根据条件获取字典表
		getDictionary:function(type,name,val){
			var dictionary;
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{
					type:type
				},
				async: false,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var dictionaryList = data.dataBody.dictionaryList;
						$.each(dictionaryList,function(i,item){
							if(val == item.value){
								dictionary = item.optionText;
							}
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
			return dictionary;
		},
		//风控模型
		getTemplate:function(id){
			var template;
			$.ajax({
				url: "/admissionTemplate/createOrUpdateFinancialOrgUser",
				type: "post",
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					if(data.errorCode == "0"){
						var admissionTemplate = data.dataBody.admissionTemplate;
						$.each(admissionTemplate,function(i,item){
							if(id == item.id){
								template = item.accessName;
							}
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
			console.log(template)
			return template;
		},
		//根据产品id获取开放地区
		getProductArea:function(){
			$.ajax({
				url: "/product/getProductArea",
				type: "get",
				dataType: "json",
				data:{
					id : util.request("id"),
				},
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var productArea = data.dataBody.productArea;
						var html = "";
						$.each(productArea,function(i,item){
							html += "<span>"+item.areaName+"</span>";
						})
						$("#area").html(html);
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
		/*修改产品状态*/			
		updateProduct:function(statusCode,statusName){
			$.ajax({
				url: "/product/updateProduct",
				type: "post",
				data:{
					id: util.request("id"),
					statusCode: statusCode,
					statusName: statusName
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						if(statusCode == "OFFLINE"){
							$.jBox.success("已下线","提示");
							$(".edit").show();
						}else{
							$.jBox.success("已上线","提示");
							$(".edit").hide();
						}
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
		toInfo : function(){
			location.href = "productInfo.html?id="+util.request("id")+"&edit=1";
		},
		toRegion : function(){
			location.href = "productRegion.html?id="+util.request("id")+"&edit=1";
		},
		toDetails : function(){
			location.href = "productDetails.html?id="+util.request("id")+"&edit=1";
		},
		toMeans : function(){
			location.href = "productMeans.html?id="+util.request("id")+"&edit=1";
		},
		toAgree : function(){
			location.href = "productAgree.html?id="+util.request("id")+"&edit=1";
		},
	}
	
})(jQuery);

$(document).ready(function($){
	product.getList();
	product.getProductArea();
}) 