(function($) {
	window.productData = null;
	window.userinfo = null;
	window.applyNo = null;
	window.applyId = null;
	window.contract = [];
	window.apply = $.fn.apply = {
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
						productData = productList;
						productList.loanAmount = productList.loanAmount/10000;
						
						var listStr ='<dd>'+
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
							'<div style="clear: both;"></div>'+
							'</div>'+
						'</dd>';
						$("#prodList").html(listStr);
						productList.Type = apply.getDictionary("productType","产品类型",productList.productType);
						$("#gbjg").val(productList.orgName).attr("readonly","readonly");
						$("#type").val(productList.Type).attr("readonly","readonly");
						$("#loanTerm").val(productList.loanTerm);
						$("#loanRate").val(productList.loanRate);
						$("#repayWay").val(productList.repayWay);
						
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
	    /* 获取用户信息 */
		getUsermeg: function(){
			$.ajax({
				url: "/user/getLoginInfo",
				type: "get",
				cache: false,
				aysnc: false,
				dataType:'json',
				success : function(data){
					if(data.errorCode == "0"){
						var loginInfo = JSON.parse(data.dataBody.loginInfo),
							userCont = loginInfo.user,
							user = JSON.parse(window.localStorage.getItem("user"));
						userinfo = {
							id : user.id,
							uuk : userCont.uuk,
							areaName: user.areaName
						}
						$("#etrName").val(user.name).attr("readonly","readonly");	
						$("#unionCode").val(user.unionCode).attr("readonly","readonly");
						$("#contactMobile").val(userCont.mobile).attr("readonly","readonly");
						$("#contactPerson").val(userCont.realName).attr("readonly","readonly");
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");	
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						window.localStorage.clear();
						setTimeout(function(){location.href = "/static/html/index.html"},1000);
						$.jBox.tip (data.errorString, "提示");
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
	    /* 融资信息提交 */
		applyStepOne:function(dataList){
			$.jBox.tip("请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringApplyStepOne",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						location.href = "applySuccess.html?applyNo="+ data.dataBody.applyNo;
					}else if(data.errorCode == "2010"){
						$.jBox.closeTip();
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
		rzvalidateForm : function(){
			$("#rzxxform").validate({
				debug: true,
				rules: {
					loanAmount: {
				      	required: true,
				      	number:true,
				      	maxlength: 11,
				      	positiveinteger: true,
				    },
				    loanTerm: {
				      	required: true,
				      	number:true,
				      	maxlength: 11,
				      	positiveinteger: true,
				    },
				    loanRate: "required",
				    repayWay: "required",
				    repayAccountNo: {
				    	required: true,
				      	isBankNo: true,
			      		minlength: 16,
			      		maxlength: 19,
				    },
				    repayAccountName: "required",
				    repayAccountBank: "required",
				},
			    messages: {
			    	loanAmount: {
			      		required: "请输入意向融资额度",
			      		number : "请输入有效数字", 
			      		maxlength: "意向融资额度长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
			      	loanTerm: {
			      		required: "请输入意向融资期限",
			      		number : "请输入有效数字", 
			      		maxlength: "意向融资期限长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
			      	loanRate: "请输入意向融资利率上限",
			      	repayWay: "请输入还款方式",
			      	repayAccountNo: {
			      		required: "请输入账号",
			      		isBankNo: "请填写正确的银行卡号",
			      		minlength: "银行账户最小16位",
			      		maxlength: "银行账户最大19位",
			      	},
			      	repayAccountName: "请输入开户名",
			      	repayAccountBank: "请输入开户行",
			    }
			});			
		},
		joindb: function() {
			$("#joinovet").show();
			$("#hbg1").show();
			var bleft = ($(window).width() - $("#joinovet").width()) / 2;
	        var btop = ($(window).height() - $("#joinovet").height()) / 2;
	         
	        $("body").addClass("modal-open");
	        // 最终模态窗口的位置
	        var left = bleft ;
	        var top = btop ;
	        $("#joinovet").css("position", "fixed");
	        $("#joinovet").css("top", "100px");
	        $("#joinovet").css("left", left);
			$("#hbg1").show();
		},
		closeDialog1: function() {
			$("#hbg1").hide();
			$("#joinovet").hide();
			$("body").removeClass("modal-open");
		},
		joindh: function() {
			$("#joinDialog").show();
			$("#hbg").show();
			var bleft = ($(window).width() - $("#joinovet").width()) / 2;
	        var btop = ($(window).height() - $("#joinovet").height()) / 2;
	         
	        $("body").addClass("modal-open");
	        // 最终模态窗口的位置
	        var left = bleft ;
	        var top = btop ;
	        var da = new Date();
		    var year = da.getFullYear();
		    var month = da.getMonth()+1;
		    var date = da.getDate();
		    var time = [year,month,date].join('-');
	        $("#joinDialog").css("position", "fixed");
	        $("#joinDialog").css("top", "100px");
	        $("#joinDialog").css("left", left);
			$("#hbg").show();
		},
		closeDialogh: function() {
			$("#hbg").hide();
			$("#joinDialog").hide();
			$("body").removeClass("modal-open");
		},
		
	}
})(jQuery);

$(document).ready(function($){
	//表单验证
	apply.rzvalidateForm();
	//用户信息
	apply.getUsermeg();
	//产品信息
	apply.getList();
	
	if(util.request("applyNo")){
		$("#ysztab").attr({"href":"#yszxx", "data-toggle":"tab"})
		$("#ysztab").click();
		window.applyNo = util.request("applyNo");
		window.applyId = util.request("applyId");
	}
	//上一步
	$("#prevOne").click(function(){
		$("#rzrtab").click();
	})
	//融资人信息下一步
	$("#rzrxxBtn").click(function(){
		if(!$("#checkBox").is(":checked")){
			$.jBox.tip("请阅读并同意《企业信用承诺联盟及数据授权协议》");
		}else{
			$("#rztab").attr({"href":"#rzxx", "data-toggle":"tab"});
			$("#rztab").click();
		}
	})
	//融资信息下一步
	$("#rzxxSubmit").click(function(){
		if($("#rzxxform").valid() == true){
			var data = {
				userUuk: userinfo.uuk,
				productId :	productData.id,
				productName : productData.productName,
				productType : productData.productType,
				loanTerm : $("#loanTerm").val(),	
				loanAmount : $("#loanAmount").val(),	
				loanRate : $("#loanRate").val(),	
				repayWay : $("#repayWay").val(),
				contactMobile : $("#contactMobile").val(),	
				contactPerson : $("#contactPerson").val(),
				etrName : $("#etrName").val(),
				unionCode : $("#unionCode").val(),
				mcode : $("#mcode").val(),	
				orgCode : productData.orgCode,	
				orgName	 : productData.orgName,
				areaCode : window.localStorage.getItem("areaCode"),	
				areaName : userinfo.areaName,	
				repayAccountNo : $("#repayAccountNo").val(),	
				repayAccountName : $("#repayAccountName").val(),	
				repayAccountBank : $("#repayAccountBank").val(),
				accessTemplateId : productData.riskId,
				loanDesc : $("#loanDesc").val()
			}
			//console.log(data)
			apply.applyStepOne(data);
		}
	})
	
	//表单自定义正整数
	jQuery.validator.addMethod("positiveinteger", function(value, element) {
	   var aint=parseInt(value);	
	    return aint>0&& (aint+"")==value;   
	 }, "Please enter a valid number."); 
	//自定义手机号验证
	jQuery.validator.addMethod("isMobile", function(value, element) {
	    var length = value.length;
	    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(19[0-9]{9})$/;
	    return this.optional(element) || (length == 11 && mobile.test(value));
	}, "请正确填写您的手机号码");
	//自定义银行卡号验证
	jQuery.validator.addMethod("isBankNo", function(value, element) {
	    return this.optional(element) || (CheckBankNo(value));
	}, "请正确填写您的银行卡号");
})
	