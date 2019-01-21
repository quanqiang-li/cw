(function($) {
	window.productType = null;
	window.productFlag = null;
	window.riskId = null;
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
						$("#productName").val(productList.productName);
						$("#productDesc").val(productList.productDesc);
						$("#loanRate").val(productList.loanRate);
						$("#loanAmount").val(productList.loanAmount/10000);
						$("#loanTerm").val(productList.loanTerm);
						$("#repayWay").val(productList.repayWay);
						$("#openArea").val(productList.openArea);
						productType = productList.productType;
						productFlag = productList.productFlag;
						riskId = productList.riskId;
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
		updateProduct:function(dataList,type){
			$.ajax({
				url: "/product/updateProduct",
				type: "post",
				data:dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						//前往下一步
						if(type == "cel"){
							location.href = "productDetails.html?id="+util.request("id");
						}else{
							$.jBox.success("保存成功","提示");
							setTimeout(function(){
								location.href = "productDetail.html?id="+util.request("id");
							},1000)
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
		toNext : function(type){
			if($("#infoForm").valid() == true){
				var data = {
					id:util.request("id"),
					productName: $("#productName").val(),
					productDesc: $("#productDesc").val(),
					loanRate: $("#loanRate").val(),
					loanAmount: Number($("#loanAmount").val()*10000),
					loanTerm: $("#loanTerm").val(),
					repayWay: $("#repayWay").val(),
			    	productType: $("#productType").val(),
			    	productFlag: $("#productFlag").val(),
					riskId: $("#riskId").val(),
					openArea: $("#openArea").val(),
				}
				product.updateProduct(data,type);
			}
		},
		//根据条件获取字典表
		getDictionary:function(type,name){
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{
					type:type
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var dictionaryList = data.dataBody.dictionaryList;
						var html = "<option value=''>请选择"+name+"</option>"
						$.each(dictionaryList,function(i,item){
							if(productType == item.value){
								html += "<option value="+item.value+" selected='selected'>"+item.optionText+"</option>";
							}else  if(productFlag == item.value){
								html += "<option value="+item.value+" selected='selected'>"+item.optionText+"</option>";
							}else{
								html += "<option value="+item.value+">"+item.optionText+"</option>";
							}
							
						})
						if(type == "productType"){
							$("#productType").html(html);
						}
						if(type == "productFlag"){
							$("#productFlag").html(html);
						}
						if(type == "productType"){
							$("#productType").html(html);
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
		//风控模型
		getTemplate:function(){
			$.ajax({
				url: "/admissionTemplate/createOrUpdateFinancialOrgUser",
				type: "post",
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var admissionTemplate = data.dataBody.admissionTemplate;
						var html = "<option value=''>请选择风控模型</option>"
						$.each(admissionTemplate,function(i,item){
							if(riskId == item.id){
								html += "<option value="+item.id+" selected='selected'>"+item.accessName+"</option>";
							}
							html += "<option value="+item.id+">"+item.accessName+"</option>"
						})
						$("#riskId").html(html);
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
		//点击下一步验证表单
		validateForm : function(){
			$("#infoForm").validate({
				debug: true,
				rules: {
					productName: "required",
					productDesc: "required",
					loanRate: "required",
					loanAmount: {
				      	required: true,
				      	number:true,
				      	positiveinteger: true,
				    },
					loanTerm: {
				      	required: true,
				      	number:true,
				      	positiveinteger: true,
				    },
					repayWay: "required",
			    	productType: "required",
			    	productFlag: "required",
					riskId: "required",
					openArea: "required",
				},
			    messages: {
			    	productName: "请输入产品名称",
			    	productDesc: "请输入产品说明",
			    	loanRate: "请输入融资利率",
			    	loanAmount: {
			      		required: "请输入融资额度",
			      		number : "请输入有效数字", 
			      		positiveinteger: "请输入大于0的整数"
			      	},
			    	loanTerm: {
			      		required: "请输入融资期限",
			      		number : "请输入有效数字", 
			      		positiveinteger: "请输入大于0的整数"
			      	},
			    	repayWay: "请选择还款方式",
			    	productType: "请选择产品类型",
			    	productFlag: "请选择产品标识",
			    	riskId: "请选择风控模型",
					openArea: "请输入产品开放地区展示内容",
			    }
			});			
		},
	}
	
})(jQuery);

$(document).ready(function($){
	
	if(util.request("edit")){
		$(".next").hide();
		product.getList();
	}
	
	product.validateForm();
	product.getDictionary("productType","产品类型");
	product.getDictionary("productFlag","产品标识");
	product.getTemplate();
	
	//自定义正整数
	jQuery.validator.addMethod("positiveinteger", function(value, element) {
	   var aint=parseInt(value);	
	    return aint>0&& (aint+"")==value;   
	 }, "Please enter a valid number."); 
})