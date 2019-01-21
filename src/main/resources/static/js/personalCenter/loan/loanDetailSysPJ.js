(function($) {
	window.applyNo = null;
	window.productType = null;
	window.unionCode = null;
	window.etrName = null; 
	window.loanAmount = null; 
	window.loanDetail = $.fn.loanDetail = {
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
						var applyList = data.dataBody.applyList;
						applyNo = applyList[0].applyNo;
						productType = applyList[0].productType;
						etrName = applyList[0].etrName;
						loanAmount = applyList[0].loanAmount;
						var source   = $("#applyList-template").html();
						var template = Handlebars.compile(source);
						$("#myTabContent").prepend(template(applyList[0]));
						if(productType == "PJTX"){
							$(".pjtxshow").show();
						}else{
							$(".pjzyshow").show();
							$("#rzxx").show();
						}
						loanDetail.getNotesInfoByApplyNo(applyList[0].applyNo);

						if(applyList[0].statusCode != "YHSQ" && applyList[0].statusCode != "ZLBC" && applyList[0].statusCode != "FKJJ"){
							$("#fktgpt").show();
						}
						if(applyList[0].statusCode != "YHSQ" && applyList[0].statusCode != "ZLBC" && applyList[0].statusCode != "FKTG" && applyList[0].statusCode != "FKJJ"){
							
							loanDetail.getPlatformHandleResult(applyList[0].applyNo);
							if(applyList[0].statusCode != "PTJJ"){
								$("#advisestauts").html("通过");
							}else{
								$("#advisestauts").html("拒绝");
							}	
							//金融机构审核
							if(applyList[0].statusCode != "PTTG" && applyList[0].statusCode != "PTJJ"){
								$("#jrjg").show();
								loanDetail.getPlatformHandleOrgResult(applyList[0].applyNo);
								if(applyList[0].statusCode != "JRJGJJ"){
									$("#permitstauts").html("通过");
								}else{
									$("#permitstauts").html("拒绝");
								}
								
								if(applyList[0].statusCode != "JRJGJJ" && applyList[0].statusCode != "JRJGTG"){
									//金融机构终审
									if(applyList[0].statusCode != "QSHT" ){
										$("#jgzs").show();
										loanDetail.getDisclosedFactoring(applyList[0].applyNo);
										if(applyList[0].statusCode !="WSX"){
											$("#orgstauts").html("通过");
										}else{
											$("#orgstauts").html("拒绝");
										}
									}							
								}
							}
						}
						loanDetail.validateForm();
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
		getDictionary:function(type,val){
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
		/*获取票据详情*/
		getNotesInfoByApplyNo:function(applyNo){
			$.ajax({
				url: "/apply/getNotesInfoByApplyNo",
				type: "get",
				data: {
					applyNo : applyNo,
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
							applyList.interestPayer = loanDetail.getDictionary("interestPayer",applyList.interestPayer);
							applyList.ticketType = loanDetail.getDictionary("ticketType",applyList.ticketType);
							applyList.promiseAgencyType = loanDetail.getDictionary("agencyType",applyList.promiseAgencyType);
							applyList.transferFlag = applyList.transferFlag == "0"?"不得转让":"可再转让";
							applyList.endorsement = applyList.endorsement == "0"?"否":"是";
							
							if(uploadContrary.length>0){
								$("#imgBack").val(uploadContrary[uploadContrary.length-1].fileDownloadWebPath);
								$("#back").html("<img class='col-sm-12 maxheight-150' src='"+uploadContrary[uploadContrary.length-1].fileDownloadWebPath+"'/>");	
							}
							if(uploadFront.length>0){
								$("#imgFront").val(uploadFront[uploadFront.length-1].fileDownloadWebPath);
								$("#front").html("<img class='col-sm-12 maxheight-150' src='"+uploadFront[uploadFront.length-1].fileDownloadWebPath+"'/>");	
							}
							if(applyList.endorsementList){
								applyList.endorsementList = JSON.parse(applyList.endorsementList);
							}

							$("#pjxx").show();
							var source   = $("#applyOne-template").html();
							var template = Handlebars.compile(source);
							$("#applyone").html(template(applyList));

							loanDetail.getAccount(applyNo);	
						}else{
							$("#rztab").click();
						}
						
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/*获取应收账款信息*/
	    getAccount:function(applyNo){
			$.ajax({
				url: "/apply/getDisclosedFactoringAccountsReceivableInfoByApplyNo",
				type: "get",
				data: {
					applyNo : applyNo,
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var accountsReceivable = data.dataBody.accountsReceivable;
						var source   = $("#applyTwo-template").html();
						var template = Handlebars.compile(source);
						$("#yszk").show();
						$("#applytwo").html(template(accountsReceivable));
						loanDetail.getApplyFile(applyNo);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		//初审
		disclosedFactoring : function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/notesPlatformHandleStatus",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$.jBox.success("提交成功","提示");
						loanDetail.getPlatformHandleResult(dataList.applyNo);
						if(dataList.statusCode != "PTJJ"){
							$("#advisestauts").html("通过");
						}else{
							$("#advisestauts").html("拒绝");
						}
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
		/*获取站点机构审核结果*/
		getPlatformHandleResult:function(applyNo){
			$.ajax({
				url: "/apply/getNotesPlatformHandleResult",
				type: "get",
				data: {
					applyNo : applyNo,
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody;
						var arr = list.platformOpinion.split(':');
						var arr = list.platformOpinion.split(':');
						list.opinion = arr[1];
						var source   = $("#applyThree-template").html();
						var template = Handlebars.compile(source);
						$("#applythree").html(template(list));
						if(productType == "PJTX"){
							$(".pjtxshow").show();
						}else{
							$(".pjzyshow").show();
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

		/*明保理：获取用户上传的文件*/
		getApplyFile:function(applyNo){
			$.ajax({
				url: "/apply/getDisclosedFactoringApplyAttachedFile",
				type: "post",
				data: {
					applyNo : applyNo,
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var res = data.dataBody;
						$.each(res.invoiceList,function(i,item){
							var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
	            	        if(fileExt == ".jpg" || fileExt == ".png"){
	            	        	itype = "image";
	            	        }else if(fileExt == ".pdf"){
	            	        	itype = "pdf";
	            	        }else{
	            	        	itype = "word";
	            	        } 
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
							$("#fpfj").append(str);
						})
						$.each(res.contractList,function(i,item){
							var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
	            	        if(fileExt == ".jpg" || fileExt == ".png"){
	            	        	itype = "image";
	            	        }else if(fileExt == ".pdf"){
	            	        	itype = "pdf";
	            	        }else{
	            	        	itype = "word";
	            	        } 
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
							$("#htfj").append(str);
						})
						$.each(res.othersList,function(i,item){
							var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
	            	        if(fileExt == ".jpg" || fileExt == ".png"){
	            	        	itype = "image";
	            	        }else if(fileExt == ".pdf"){
	            	        	itype = "pdf";
	            	        }else{
	            	        	itype = "word";
	            	        } 
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
							$("#qtfj").append(str);
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
		/*获取金融机构审核结果*/
		getPlatformHandleOrgResult:function(applyNo){
			$.ajax({
				url: "/apply/getNotesFinancialOrgHandleResult",
				type: "get",
				data: {
					applyNo : applyNo,
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody;
						var arr = list.platformOpinion.split(':');
						list.opinion = arr[1];
						var source   = $("#applyFour-template").html();
						var template = Handlebars.compile(source);
						$("#sptab").html(template(list));
						if(productType == "PJTX"){
							$(".pjtxshow").show();
						}else{
							$(".pjzyshow").show();
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
		/*明保理：获取金融机构用户 最终处理*/
		getDisclosedFactoring:function(applyNo){
			$.ajax({
				url: "/apply/getNotesFinancialOrgFinalHandle",
				type: "get",
				data: {
					applyNo : applyNo,
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody;
						var arr = list.financialOrgOpinion.split(':');
						list.opinion = arr[1];
						var source   = $("#applySix-template").html();
						var template = Handlebars.compile(source);
						$("#zstab").html(template(list));
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
		//查看报告
		opendhReport : function(type){
			$.ajax({
				url: "/report/dhjkReport",
				type: "get",
				data: {
					applyNo: applyNo,
					reportType: type,
					loanName: window.localStorage.getItem("tel"),
					qymc: etrName,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						window.open(data.dataBody.viewName);
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		toContract : function(id){
			window.open("/static/html/personalCenter/loan/templateView.html?templateId="+id+"&applyId="+applyId);
		},
		//点击下一步验证表单
		validateForm : function(){
			var dataRules = {},
				datamessages = {};
			if(productType == "PJTX"){
				dataRules = {
			      	required: true,
			      	number:true,
		      		maxlength: 11,
			      	positiveinteger: true,
			    }
				datamessages = {
		      		required: "请输入试算融资实付金额",
		      		number : "请输入有效数字", 
		      		maxlength: "建议融资额度长度不能大于11个字符",
		      		positiveinteger: "请输入大于0的整数"
		      	}
			}else{
				dataRules = {
			      	required: true,
			      	number:true,
			      	max: loanAmount,
		      		maxlength: 11,
			      	positiveinteger: true,
			    }
				datamessages = {
		      		required: "请输入建议融资额度",
		      		number : "请输入有效数字", 
		      		max:"建议融资金额不能大于意向融资金额",
		      		maxlength: "建议融资额度长度不能大于11个字符",
		      		positiveinteger: "请输入大于0的整数"
				}
			}
			$("#csform").validate({
				debug: true,
				rules: {
					adviseLoanAmount: dataRules,
				    adviseLoanTerm: {
				      	required: true,
				      	number:true,
			      		maxlength: 11,
				      	positiveinteger: true,
				    },
				    adviseLoanRate: "required",
				    adviseRepayWay: "required",
			      	status: "required",
			      	opinion: {
			      		required: true,
			      		maxlength: 200,
			      	}
				},
			    messages: {
			    	adviseLoanAmount: datamessages,
			      	adviseLoanTerm: {
			      		required: "请输入建议融资期限",
			      		number : "请输入有效数字", 
			      		maxlength: "建议融资期限长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
			      	adviseLoanRate: "请输入建议融资利率上限",
			      	adviseRepayWay: "请输入还款方式",
			      	status: "请选择操作",
			      	opinion: {
			      		required: "请输入审批",
			      		maxlength: "审批内容长度不能大于200个字符"
			      	}
			    }
			});			
		},
	}
	
})(jQuery);

$(document).ready(function($){
	loanDetail.getApplylist();
	$("#submit").click(function(){
		if($("#status").val() == "PTTG"){
			if($("#csform").valid() == true){				
				if(productType == "PJZY"){
					var data = {
						applyNo: applyNo,
						adviseLoanAmount : $("#adviseLoanAmountzy").val(),	
						adviseLoanRate : $("#adviseLoanRatezy").val(),
						adviseRepayWay : $("#adviseRepayWay").val(),	
						adviseLoanTerm : $("#adviseLoanTerm").val(),
						statusCode : $("#status").val(),
						opinion: $("#opinion").val(),
					}
				}else{
					var data = {
						applyNo: applyNo,
						adviseLoanAmount : $("#adviseLoanAmount").val(),	
						adviseLoanRate : $("#adviseLoanRate").val(),
						statusCode : $("#status").val(),
						opinion: $("#opinion").val(),
					}
				}
				loanDetail.disclosedFactoring(data);
			}
		}else if($("#status").val() == "PTJJ"){
			var data = {};
			if($("#adviseLoanAmount").val() != ""){
				if(productType == "PJZY"){
					data.adviseLoanAmount = $("#adviseLoanAmountzy").val();
				}else{
					data.adviseLoanAmount = $("#adviseLoanAmount").val();
				}
			}
			if($("#adviseLoanRate").val() != ""){
				if(productType == "PJZY"){
					data.adviseLoanAmount = $("#adviseLoanRatezy").val();
				}else{
					data.adviseLoanRate = $("#adviseLoanRate").val();
				}
			}
			if($("#adviseRepayWay").val() != ""){
				data.adviseRepayWay = $("#adviseRepayWay").val();
			}
			if($("#adviseLoanTerm").val() != ""){
				data.adviseLoanTerm = $("#adviseLoanTerm").val();
			}
			if($("#opinion").val() != ""){
				data.opinion = $("#opinion").val();
			}else{
				$.jBox.tip ("请输入审批", "提示");
				return false;
			}
			data.applyNo = applyNo;
			data.statusCode = $("#status").val();
			loanDetail.disclosedFactoring(data);
		}else{
			$.jBox.tip ("请选择操作", "提示");
		}
	})
	
	
	//表单自定义正整数
	jQuery.validator.addMethod("positiveinteger", function(value, element) {
	   var aint=parseInt(value);	
	    return aint>0&& (aint+"")==value;   
	 }, "Please enter a valid number."); 
}) 