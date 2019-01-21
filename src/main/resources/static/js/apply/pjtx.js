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
		/*获取票据详情*/
		getNotesInfoByApplyNo:function(){
			$.ajax({
				url: "/apply/getNotesInfoByApplyNo",
				type: "get",
				data: {
					applyNo : util.request("applyNo"),
				},
				dataType: "json",
				async: false,
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						if(data.dataBody.applyTicket){
							var applyList = data.dataBody.applyTicket,
								uploadContrary = data.dataBody.uploadBillContraryFileList,
								uploadFront = data.dataBody.uploadBillFrontFileList;
							$("#ticketNo").val(applyList.ticketNo);	
							$("#ticketType").attr("data-id",applyList.ticketType);	
							$("#ticketAmount").val(applyList.ticketAmount);	
							$("#ticketDueDate").val(applyList.ticketDueDate);
							$("#discountDeposit").val(applyList.discountDeposit);	
							$("#interestPayer").attr("data-id",applyList.interestPayer);
							$("#promiseAgencyName").val(applyList.promiseAgencyName);
							$("#agencyType").attr("data-id",applyList.promiseAgencyType);
							$("#transferFlag").val(applyList.transferFlag);	
							$("#endorsement").val(applyList.endorsement);
							$("#loanDesc").val(applyList.remark);
							if(applyList.endorsement == "1"){
								$("#pjbsr").show();
							}else{
								$("#pjbsr").hide();
							}
							$("#ysztab").click();
							if(uploadContrary.length>0){
								$("#imgBack").val(uploadContrary[uploadContrary.length-1].fileDownloadWebPath);
								$("#back").html("<img class='col-sm-12 maxheight-150' src='"+uploadContrary[uploadContrary.length-1].fileDownloadWebPath+"'/>");	
							}
							if(uploadFront.length>0){
								$("#imgFront").val(uploadFront[uploadFront.length-1].fileDownloadWebPath);
								$("#front").html("<img class='col-sm-12 maxheight-150' src='"+uploadFront[uploadFront.length-1].fileDownloadWebPath+"'/>");	
							}
							if(applyList.endorsementList){
								var endorsementList = JSON.parse(applyList.endorsementList),
								 	html = "";
								$.each(endorsementList,function(i,item){
									html += '<tr>'+
									'<td><input class="form-control" type="text" name="Endorser" value="'+item.Endorser+'" /></td>'+
										'<td><input class="form-control" type="text" name="Endorsed" value="'+item.Endorsed+'"/></td>'+
									'</tr>';
								})
								$("#bsrlist").html(html);
							}
								
						}else{
							$("#rztab").click();
						}
						
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$("#rztab").click();
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
						applyId = applyList.id;
						$("#contactMobile").val(applyList.contactMobile);	
						$("#contactPerson").val(applyList.contactPerson);
						$("#etrName").val(applyList.etrName);
						$("#unionCode").val(applyList.unionCode);
						$("#mcode").val(applyList.mcode);	
						$("#repayAccountNo").val(applyList.repayAccountNo);	
						$("#repayAccountName").val(applyList.repayAccountName);	
						$("#repayAccountBank").val(applyList.repayAccountBank);
						$("#postAccountNo").val(applyList.postAccountNo);
						$("#postBankNo").val(applyList.postBankNo);
						$("#discountAccountNo").val(applyList.discountAccountNo);
						$("#discountBankNo").val(applyList.discountBankNo);
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
						var dictionaryList = data.dataBody.dictionaryList,
							html = "<option value=''>请选择票据种类</option>",
							radio = "";
						$.each(dictionaryList,function(i,item){
							if(val == item.value && val){
								dictionary = item.optionText;
							}else if(type == "ticketType"){
								if($("#ticketType").attr("data-id") == item.value){
									html += "<option value="+item.value+" selected>"+item.optionText+"</option>";
								}else{
									html += "<option value="+item.value+">"+item.optionText+"</option>";
								}
							}else if(type == "interestPayer" || type == "agencyType"){
								if(item.value == $("#"+type).attr("data-id")){
									radio += '<label class="mleft-10"><input type="radio" name="'+type+'" checked value='+item.value+'>'+item.optionText+"</label>";
								}else{
									radio += '<label class="mleft-10"><input type="radio" name="'+type+'" value='+item.value+'>'+item.optionText+"</label>";
								}
							}
						})
						if(type == "ticketType"){
							$("#ticketType").html(html);
						}else if(type == "interestPayer" || type == "agencyType"){
							$("#"+type).html(radio);
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
						$("#rztab").attr({"href":"#rzxx", "data-toggle":"tab"});
						$("#rztab").click();
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
	    /* 票据信息提交 */
		applyStepTwo:function(dataList){
			$.jBox.tip("请稍后...", 'loading');
			$.ajax({
				url: "/apply/notesApplyStepTwo",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$("#ysztab").attr({"href":"#yszxx", "data-toggle":"tab"})
						$("#ysztab").click();
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
		/* 合同信息相关提交 */
		applyStepThree:function(dataList){
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
		tcrxxvalidateForm : function(){
			$("#tcrxxform").validate({
				debug: true,
				rules: {
					postAccountNo: {
				    	required: true,
				      	isBankNo: true,
			      		minlength: 16,
			      		maxlength: 19,
				    },
				    postBankNo:  "required",
				    discountAccountNo: {
				    	required: true,
				      	isBankNo: true,
			      		minlength: 16,
			      		maxlength: 19,
				    },
				    discountBankNo: "required",
				    checkBox: "required",
				},
			    messages: {
			    	postAccountNo: {
			      		required: "请输入贴出人账号",
			      		isBankNo: "请填写正确的银行卡号",
			      		minlength: "银行账户最小16位",
			      		maxlength: "银行账户最大19位",
			      	},
			      	postBankNo: "请输入贴出人开户行行号",
			      	discountAccountNo: {
			      		required: "请输入贴现资金入账账号",
			      		isBankNo: "请填写正确的银行卡号",
			      		minlength: "银行账户最小16位",
			      		maxlength: "银行账户最大19位",
			      	},
			      	discountBankNo: "请输入贴现资金入账行号",
			      	checkBox: "请阅读并同意《企业信用承诺联盟及数据授权协议》",
			    }
			});			
		},
		//点击下一步验证表单
		rzxxvalidateForm : function(){
			$("#rzxxform").validate({
				debug: true,
				rules: {
					ticketNo: "required",
					ticketType: "required",
					ticketAmount: {
				      	required: true,
				      	number:true,
				      	maxlength: 11,
				    },
					ticketDueDate: "required",
					discountDeposit: {
				      	required: true,
				      	number:true,
				      	maxlength: 11,
				    },
					interestPayer: "required",
					promiseAgencyName: "required",
					agencyType: "required",
					transferFlag: "required",
					endorsement: "required",
					imgFront: "required",
					imgBack: "required",
					loanDesc: {
			      		maxlength: 200,
			      	}
				},
			    messages: {
			    	ticketNo: "请输入电子票据号码",
					ticketType: "请选择票据种类",
					ticketAmount: {
				      	required: "请输入票据金额",
			      		number : "请输入有效数字", 
			      		maxlength: "票据金额长度不能大于11个字符",
				    },
					ticketDueDate: "请输入票据到期日",
					discountDeposit: {
				      	required: "请输入贴现保证金",
			      		number : "请输入有效数字", 
			      		maxlength: "贴现保证金长度不能大于11个字符",
				    },
					interestPayer: "请选择付息人",
					promiseAgencyName: "请输入承兑机构全称",
					agencyType: "请选择承兑机构类型",
					transferFlag: "请选择不得转让标记",
					endorsement: "请选择是否已背书",
					imgFront: "请上传票据正面",
					imgBack: "请上传票据反面",
					loanDesc: {
			      		maxlength: "备注长度不能大于200个字符",
			      	}
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
			      	contractAmount: {
				      	required: true,
				      	number:true,
				    },
			      	contractGoods: "required",
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
						required: "请输入贸易合同号",
						maxlength: "合同号不能大于30个字符",
			      	},
			      	contractAmount: {
			      		required: "请输入贸易合同金额",
			      		number : "请输入有效数字", 
			      	},
			      	contractGoods: "请输入贸易合同货物名称",
			      	contractTerm: "请输入贸易合同期限",
			      	contractSignDate: "请选择贸易合同签署日期",
			      	contractPayDate: "请选择贸易合同付款日期",
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
		getFile: function(fileVal, file, elem, type, form, inpuelm){
			if(!fileVal){
				return false;
			}
	        var formData = new FormData($(form)[0]);
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
                        if(form == "yszform"){
                        	if(type == "F033"){
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
	            			$("#"+elem).append(str);
                        }else if(form == "rzxxform"){
                        	$("#"+inpuelm).val(data.dataBody.fileDownloadWebPath);
                        	$("#"+elem).html("<img class='col-sm-12 maxheight-150'  src='"+data.dataBody.fileDownloadWebPath+"'/>");
                        }
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
	apply.tcrxxvalidateForm();
	apply.rzxxvalidateForm();
	apply.yszvalidateForm();
	//用户信息
	apply.getUsermeg();
	//产品信息
	apply.getList();
	
	if(util.request("applyNo")){
		$("#rztab").attr({"href":"#rzxx", "data-toggle":"tab"});
		$("#ysztab").attr({"href":"#yszxx", "data-toggle":"tab"});
		window.applyNo = util.request("applyNo");
		window.applyId = util.request("applyId");
		apply.getApplylist();
		apply.getNotesInfoByApplyNo();
	}
	apply.getDictionary("ticketType");
	apply.getDictionary("interestPayer");
	apply.getDictionary("agencyType");
	
	//上一步
	$("#prevOne").click(function(){
		$("#rzrtab").click();
	})
	$("#prevTwo").click(function(){
		$("#rztab").attr({"href":"#rzxx", "data-toggle":"tab"});
		$("#rztab").click();
	})
	//贴出人信息下一步
	$("#rzrxxBtn").click(function(){
		if($("#tcrxxform").valid() == true){
			var data = {
				applyNo: applyNo,
				userUuk: userinfo.uuk,
				productId :	productData.id,
				productName : productData.productName,
				productType : productData.productType,
				contactMobile : $("#contactMobile").val(),	
				contactPerson : $("#contactPerson").val(),
				etrName : $("#etrName").val(),
				unionCode : $("#unionCode").val(),
				orgCode : productData.orgCode,	
				orgName	 : productData.orgName,
				areaCode : window.localStorage.getItem("areaCode"),	
				areaName : userinfo.areaName,	
				postAccountNo: $("#postAccountNo").val(),
			    postBankNo:  $("#postBankNo").val(),
			    discountAccountNo: $("#discountAccountNo").val(),
			    discountBankNo:$("#discountBankNo").val(),
				mcode : $("#mcode").val(),	
			}
			//console.log(data)
			apply.applyStepOne(data);
		}
	})
	
	$("#addTr").on("click",function(){
		var html = '<tr>'+
			'<td><input class="form-control" type="text" name="Endorser"/></td>'+
				'<td><input class="form-control" type="text" name="Endorsed"/></td>'+
			'</tr>';
		$("#bsrlist").append(html);
	})
	$("#minusTr").on("click",function(){
		$("#bsrlist tr:last").remove();
	})
	//票据信息下一步
	$("#rzxxSubmit").click(function(){
		if($("#rzxxform").valid() == true){
			var data = {
				applyNo: applyNo,
				applyId: applyId,
				ticketNo : $("#ticketNo").val(),	
				ticketType : $("#ticketType").val(),	
				ticketAmount : $("#ticketAmount").val(),	
				ticketDueDate : $("#ticketDueDate").val(),
				discountDeposit : $("#discountDeposit").val(),
				interestPayer : $("input[name='interestPayer']:checked").val(),
				promiseAgencyName : $("#promiseAgencyName").val(),	
				promiseAgencyType : $("input[name='agencyType']:checked").val(),	
				transferFlag : $("#transferFlag").val(),	
				endorsement : $("#endorsement").val(),
				remark : $("#loanDesc").val()
			}
			var EndorsedList = [];
			if(data.endorsement == "1"){
				$("#bsrlist tr").each(function(){
					var Endorser =  $(this).find('input[name=Endorser]').val(),
						Endorsed = $(this).find('input[name=Endorsed]').val()
					if(Endorser != "" || Endorsed !=""){
						var datalist = {
							Endorser: Endorser,
							Endorsed: Endorsed,
						}
						EndorsedList.push(datalist);
					}
				})
				data.endorsementList = JSON.stringify(EndorsedList)
			}
				
			if((EndorsedList.length>0 && data.endorsement == "1") || (EndorsedList.length==0 && data.endorsement == "0")){
				//console.log(data)
				apply.applyStepTwo(data);
			}else{
				$.jBox.tip("请输入背书人企业名称与被背书人企业名称");
			}
			
		}
	})
	//合同信息提交
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
				apply.applyStepThree(data);
			}else if(contract.length == 0){
				$.jBox.tip("请上传合同附件","提示");
			}else if(window.localStorage.getItem("selectedInvoice")){
				$.jBox.tip("请选择合同对应发票","提示");
			}
		}
	})	
	//上传上传票据正面
	$("#front").click(function(){
		$("#upFront").click();
	})
	$("#upFront").change(function(){
		apply.getFile($(this).val(), 'upFront', "front","F031", "rzxxform","imgFront");
	})	
	//上传票据背面
	$("#back").click(function(){
		$("#upBack").click();
	})
	$("#upBack").change(function(){
		apply.getFile($(this).val(), 'upBack', "back","F032", "rzxxform","imgBack");
	})
	//上传合同附件
	$("#uphtfj").click(function(){
		$("#htfj").click();
	})
	$("#htfj").change(function(){
		apply.getFile($(this).val(), 'htfj', "htfjCont","F033", "yszform");
	})
	//上传发票附件
	$("#upfpfj").click(function(){
		$("#fpfj").click();
	})
	$("#fpfj").change(function(){
		apply.getFile($(this).val(), 'fpfj', "fpfjCont","F034", "yszform");
	})
	//上传其他附件
	$("#upqtfj").click(function(){
		$("#qtfj").click();
	})
	$("#qtfj").change(function(){
		apply.getFile($(this).val(), 'qtfj', "qtfjCont","F035", "yszform");
	})
	
	$("#endorsement").change(function(){
		if($(this).val() == "1"){
			$("#pjbsr").show();
		}else{
			$("#pjbsr").hide();
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
	