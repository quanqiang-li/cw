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
		/*获取申请详情*/
		getApplylist:function(){
			$.ajax({
				url: "/apply/getApplyInfoByCondition",
				type: "get",
				data: {
					applyNo : util.request("applyNo"),
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var applyList = data.dataBody.applyList[0];
						$("#loanTerm").val(applyList.loanTerm);	
						$("#loanAmount").val(applyList.loanAmount);	
						$("#loanRate").val(applyList.loanRate);	
						$("#repayWay").val(applyList.repayWay);
						$("#contactMobile").val(applyList.contactMobile);	
						$("#contactPerson").val(applyList.contactPerson);
						$("#etrName").val(applyList.etrName);
						$("#unionCode").val(applyList.unionCode);
						$("#mcode").val(applyList.mcode);	
						$("#repayAccountNo").val(applyList.repayAccountNo);	
						$("#repayAccountName").val(applyList.repayAccountName);	
						$("#repayAccountBank").val(applyList.repayAccountBank);
						$("#loanDesc").val(applyList.loanDesc);
						$("#checkBox").attr("checked",true);
						window.localStorage.setItem("areaCode",applyList.areaCode);
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
						$("#ysztab").attr({"href":"#yszxx", "data-toggle":"tab"})
						$("#ysztab").click();
						applyNo = data.dataBody.applyNo;
						applyId = data.dataBody.applyId
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
		/* 应收账款信息提交 */
		applyStepTwo:function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringApplyStepTwo",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						window.localStorage.removeItem("selectedInvoice");
						location.href = "applySuccess.html?applyNo="+ dataList.applyNo;
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
		//点击下一步验证表单
		yszvalidateForm : function(){
			$("#yszform").validate({
				debug: true,
				rules: {
					buyerName: "required",
					buyerunionCode: "required",
					buyerContactName: "required",
					buyerContactMobile:{
						required: true,
			      		minlength: 11,
				    	isMobile : true
			      	},
			      	contractNo:{
						required: true,
			      		maxlength: 30,
			      	},
			      	contractName: "required",
			      	contractAmount: {
				      	required: true,
				      	number:true,
			      		maxlength: 11,
				    },
			      	receiveBankName: "required",
			      	contractGoods: "required",
			      	receiveAccountName: "required",
			      	receiveAccountNo: {
				    	required: true,
				      	isBankNo: true,
			      		minlength: 16,
			      		maxlength: 19,
				    },
			      	contractTerm: "required",
			      	contractSignDate: "required",
			      	contractPayDate: "required",
			      	contractInvoiceDate: "required",
			      	remark: {
			      		maxlength: 200,
			      	}
				},
			    messages: {
			    	buyerName: "请输入购方名称",
			    	buyerUnionCode: "请输入购方统一社会信用代码",
			    	buyerContactName: "请输入购方联系人",
					buyerContactMobile:{
			      		required: "请填写手机号码",
			      		minlength : "确认手机不能小于11个字符",
			      		isMobile : "请输入正确的手机号"
			      	},
			      	contractNo:{
						required: "请输入应收账款合同号",
						maxlength: "合同号不能大于30个字符",
			      	},
			      	contractName: "请输入合同名称",
			      	contractAmount: {
			      		required: "请输入应收账款金额",
			      		number : "请输入有效数字", 
			      		maxlength: "应收账款金额长度不能大于11个字符",
			      	},
			      	contractGoods: "请输入合同货物名称",
			      	receiveBankName: "请输入收款行",
			      	receiveAccountName: "请输入收款账号开户名",
			      	receiveAccountNo: {
			      		required: "请输入收款账号",
			      		isBankNo: "请填写正确的银行卡号",
			      		minlength: "银行账户最小16位",
			      		maxlength: "银行账户最大19位",
			      	},
			      	contractTerm: "请输入合同期限",
			      	contractSignDate: "请选择合同签署日期",
			      	contractPayDate: "请选择合同付款日期",
			      	contractInvoiceDate: "请选择发票开具日期",
			      	remark: {
			      		maxlength: "备注长度不能大于200个字符",
			      	}
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
		getFile: function(fileVal,file,elem,type){
	        var formData = new FormData($("#yszform")[0]);
            formData.append("file",document.getElementById(file).files[0]);
            formData.append("uploadFileType",type);
            formData.append("fileBusinessIdentification",applyId);
            
			$.ajax({
                url :'/file/standardFileUpload',
                type : 'POST',
                data : formData,
                async : false,
                cache : false,
                contentType : false,
                processData : false,
                success : function(data) {
                    if (data.errorCode == "0") {
                        $.jBox.tip("上传成功");
                        if(type == "F013"){
                        	contract.push(data.dataBody.fileDownloadWebPath);
                        }
                        var file = fileVal,
                        //获取文件名+扩展名
        	            fileName = file.split("\\").pop(),
        	            //获取文件的扩展名
        	            fileExt = file.substr(file.indexOf("."));
            	
            	        if(fileExt == ".jpg" || fileExt == ".png"){
            	        	itype = "image";
            	        }else if(fileExt == ".pdf"){
            	        	itype = "pdf";
            	        }else{
            	        	itype = "word";
            	        }    
            			var str = '<p class="left filefj"><i class="fa fa-file-'+itype+'-o fsize-35"></i><span>'+fileName+'</span></p>';
            			$("#"+elem).append(str)
                    }else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					} else {
        				//$.jBox.closeTip();
                        $.jBox.tip(data.errorString);
                    }
                },
				error:function(){
					$.jBox.tip("服务器异常，请稍后重试。");
				}
            });
			
		}
	}
})(jQuery);

$(document).ready(function($){
	//表单验证
	apply.rzvalidateForm();
	apply.yszvalidateForm();
	//用户信息
	apply.getUsermeg();
	//产品信息
	apply.getList();
	
	if(util.request("applyNo")){
		$("#ysztab").attr({"href":"#yszxx", "data-toggle":"tab"})
		$("#ysztab").click();
		window.applyNo = util.request("applyNo");
		window.applyId = util.request("applyId");
		apply.getApplylist();
	}
	//上一步
	$("#prevOne").click(function(){
		$("#rzrtab").click();
	})
	$("#prevTwo").click(function(){
		$("#rztab").attr({"href":"#rzxx", "data-toggle":"tab"});
		$("#rztab").click();
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
				applyNo: applyNo,
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
	//应收账款信息提交
	$("#yszSubmit").click(function(){
		if($("#yszform").valid() == true){
			var data = {
				applyNo : applyNo,
				buyerName : $("#buyerName").val(),
				buyerUnionCode : $("#buyerUnionCode").val(),
				buyerContactName : $("#buyerContactName").val(),
				buyerContactMobile : $("#buyerContactMobile").val(),
				contractNo : $("#contractNo").val(),
				contractName : $("#contractName").val(),
				contractAmount : $("#contractAmount").val(),
				contractGoods : $("#contractGoods").val(),
				contractTerm : $("#contractTerm").val(),
				receiveBankName : $("#receiveBankName").val(),
				receiveAccountName : $("#receiveAccountName").val(),
				receiveAccountNo : $("#receiveAccountNo").val(),
				contractSignDate : $("#contractSignDate").val(),
				contractPayDate : $("#contractPayDate").val(),
				contractInvoiceDate : $("#contractInvoiceDate").val(),
				remark : $("#remark").val(),
			}
			//console.log(data);
			if(contract.length > 0 && window.localStorage.getItem("selectedInvoice") ){
				apply.applyStepTwo(data);
			}else if(contract.length == 0){
				$.jBox.tip("请上传合同附件","提示");
			}else if(window.localStorage.getItem("selectedInvoice")){
				$.jBox.tip("请选择合同对应发票","提示");
			}
		}
	})	
	
	//上传合同附件
	$("#uphtfj").click(function(){
		$("#htfj").click();
	})
	$("#htfj").change(function(){
		apply.getFile($(this).val(), 'htfj', "htfjCont","F013");
	})
	//上传发票附件
	$("#upfpfj").click(function(){
		$("#fpfj").click();
	})
	$("#fpfj").change(function(){
		apply.getFile($(this).val(), 'fpfj', "fpfjCont","F014");
	})
	//上传其他附件
	$("#upqtfj").click(function(){
		$("#qtfj").click();
	})
	$("#qtfj").change(function(){
		apply.getFile($(this).val(), 'qtfj', "qtfjCont","F015");
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
	//点击选择发票
	var user = JSON.parse(window.localStorage.getItem("user"));
	$("#invoiceChoose").click(function(){
		if($("#contractInvoiceDate").val() != "" && $("#contractGoods").val() != "" && $("#buyerName").val() != ""){
			var data = {
				purchaseCom : $("#buyerName").val(),
				contractNo : $("#contractNo").val(),
				contractGoods : $("#contractGoods").val(),
				reimburseCom : user.name,
				contractInvoiceDate:$("#contractInvoiceDate").val()
			} 
			window.localStorage.setItem("invoice", JSON.stringify(data));
			$('#iframeIn').attr("src","invoice.html?id="+util.request("id")+"&applyNo="+applyNo+"&applyId="+applyId);
			$('#myModal').modal({show:true})
			
		}else if($("#contractInvoiceDate").val() == ""){
			$.jBox.tip("请选择发票开具日期","提示");
		}else if($("#contractGoods").val() == ""){
			$.jBox.tip("请输入货物名称","提示");
		}else{
			$.jBox.tip("请输入购方企业名称","提示");
		}
	});
	$('#myModal').on('hide.bs.modal', function () {
		if(window.localStorage.getItem("selectedInvoice")){
			$("#htfp").show();
			var selectedInvoiceList = JSON.parse(window.localStorage.getItem("selectedInvoice"));
			var source   = $("#rz-template").html();
			var template = Handlebars.compile(source);
			$("#rz-table").html(template(selectedInvoiceList));
		}
	})
})
	