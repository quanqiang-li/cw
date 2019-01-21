(function($) {
	window.orgCode = [];
	window.cityArr = [];
	window.productFlag = null;
	window.product = $.fn.product = {
		/*获取产品列表*/
		getList:function(productId){
			$.ajax({
				url: "/product/getProductByKey",
				type: "get",
				data: {
					id : productId,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var productList = data.dataBody.product;
						productList.loanAmount = productList.loanAmount/10000;
						orgCode = productList.orgCode;
						var listStr ='<dd class="prod-deta">'+
							'<div class="prod-rf">'+
								'<h3 data-id='+productList.id+'>'+(productList.productName==null?"产品":productList.productName)+'</h3>'+
								'<p>'+productList.productDesc+'</p>'+
								'<ul class="prod-conts">'+
									'<li class="w-300"><em>融资额度：</em><b class="col-red">'+(productList.loanAmount==null?"--":productList.loanAmount)+'万</b></li>'+
									'<li class="w-300"><em>融资利率：</em><b class="col-red">'+(productList.loanRate==null?"--":productList.loanRate)+'</b></li>'+
									'<li><em>融资期限：</em><b class="col-red">'+(productList.loanTerm==null?"--":productList.loanTerm)+'个月</b></li>'+
									'<li class="w-300"><em>合作机构：</em><span>'+productList.orgName+'</span></li>'+
									'<li class="w-300"><em>还款方式：</em><span>'+productList.repayWay+'</span></li>'+
									'<li><em class="left">开放城市：</em><span class="citys" title='+productList.openArea+'>'+productList.openArea+'</span></li>'+
								'</ul>'+
								'<div style="clear: both;"></div>'+
								'<div class="prod-meg">'+
								'<span class="ico blue">企业法人</span>'+
								'<span class="ico red">不限</span>'+
								'<span class="ico green">最快当日到账</span>'+
							'</div>'+
							'</div>'+
						'</dd>';
						$("#prodList").html(listStr);
						$("#bankId").html(productList.productName);
						$("#bankId").attr("title",productList.productName);
						$("#detail-mate").html(productList.productDesc);
						$("#Prodxw").append(productList.elementOne);
						$("#Prodxe").append(productList.elementTwo);
						$("#Prodxy").append(productList.elementThree);
						$("#prodNav li").click(function(){
							$(this).addClass("nav-pitch").siblings().removeClass("nav-pitch");
						})
						productFlag = productList.productFlag;
						
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
	    /*获取在线产品的机构列表*/
		getOrgList:function(){
			$.ajax({
				url: "/product/getProductOrg",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.productOrg;
						$.each(list,function(i,item){
							if(orgCode == item.code){
								$("#logo").attr({"src":item.logo,"alt":item.name});
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
		},
		//根据产品id获取开放地区
		getProductArea:function(productId){
			$.ajax({
				url: "/product/getProductArea",
				type: "get",
				dataType: "json",
				data: {
					id : productId,
				},
				async: false,
				cache: false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						var productArea = data.dataBody.productArea;
						$.each(productArea,function(i,item){
							if($.inArray(item.areaCode, cityArr) == -1){
								cityArr.push(item.areaCode);
							}							
						})
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						/*setTimeout(function(){
							location.href = "/static/html/index.html";
							//window.localStorage.clear();
						},1000)*/
					}else{
						$.jBox.tip(data.errorString);
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/* 判断用户是否实名  */
		Verified : function(user,productId){
			$.ajax({
				url: "/apply/isUserAndCorpVerified",
				type: "get",
				dataType: "json",
				data:{
					orgId : user.id,
				},
				cache:false,
				success : function(data){
					console.log(data);
					if(data.errorCode == "0"){
						var areaCode = user.areaCode;
						console.log(areaCode,cityArr)
						if(areaCode){
							var codeSJ = areaCode.slice(0,4)+"00",
								codeXJ = areaCode.slice(0,2)+"0000";
							if($.inArray(areaCode, cityArr) != -1 || $.inArray(codeSJ, cityArr) != -1 || $.inArray(codeXJ, cityArr) != -1){
								if($.inArray(areaCode, cityArr) != -1){
									window.localStorage.setItem("areaCode",areaCode);
								}else if($.inArray(codeSJ, cityArr) != -1){
									window.localStorage.setItem("areaCode",codeSJ);
								}else if($.inArray(codeXJ, cityArr) != -1){
									window.localStorage.setItem("areaCode",codeXJ);
								}
								if(productFlag == "MBL_BZ" || productFlag == "ABL_BZ" || productFlag == "YSZKZY_BZ" || productFlag == "CRZ_BZ" || productFlag == "PJZY_BZ" || productFlag == "PJTX_BZ"){
									location.href = "/static/html/apply/"+productFlag+".html?id=" + productId;
								}else{
									$.jBox.info("产品尚未上线，敬请期待！", "提示");	
								}
							}else{
								$.jBox.info("该产品的开放城市没有覆盖您所属的区域,不能申请,请重新选择产品！", "提示");	
							}
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
	}
})(jQuery);

$(document).ready(function($){
	var productId;
	if(util.request("id").indexOf("#") != -1){
		productId = util.request("id").slice(0, util.request("id").indexOf("#"));
	}else{
		productId = util.request("id");
	}
	
	product.getOrgList();
	product.getList(productId);
	$("#apply").click(function(){
		if(!window.localStorage.getItem("user")){
			$.jBox.error("请登录","提示");	
		}else{
			var user = JSON.parse(window.localStorage.getItem("user"));
			if(user.type == "4"){
				product.getProductArea(productId);
				product.Verified(user,productId);
			}else{
				$.jBox.error("请登录企业用户申请该产品","提示");	
			}
			
		}
	})
	window.localStorage.removeItem("selectedInvoice");
	window.localStorage.removeItem("yszkData");
})
	