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

						if(applyList[0].productType != "CRZ"){
							loanDetail.getAccount(applyList[0].applyNo);
						}else{
							$(".crzinpt").show();
							unionCode = applyList[0].unionCode;
							loanDetail.standardCalInvoice(applyList[0].unionCode,applyList[0].etrName);
						}
						
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
									//买方确认
									if(applyList[0].productType == "MBL"){
										if(applyList[0].statusCode != "QSHT" ){	
											$("#mfqr").show();
											loanDetail.getNotice(applyList[0].applyNo);
											loanDetail.getPurchaserResult(applyList[0].applyNo);
											if(applyList[0].statusCode !="TZHJJ"){
												$("#purchaserstauts").html("通过");
											}else{
												$("#purchaserstauts").html("拒绝");
											}
											//金融机构终审
											if(applyList[0].statusCode != "TZHJJ" && applyList[0].statusCode != "TZHTG"){
												$("#jgzs").show();
												loanDetail.getDisclosedFactoring(applyList[0].applyNo);
												if(applyList[0].statusCode !="WSX"){
													$("#orgstauts").html("通过");
												}else{
													$("#orgstauts").html("拒绝");
												}
											}
										}
									}else{
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
						$("#yszk").show();
						var accountsReceivable = data.dataBody.accountsReceivable;
						var source   = $("#applyTwo-template").html();
						var template = Handlebars.compile(source);
						$("#applytwo").html(template(accountsReceivable));
						loanDetail.getApplyFile(applyNo);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$("#yszk").hide();
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		//池融资标准计算
		standardCalInvoice : function(nsrsbh,etrName){
			$.ajax({
				url: "/invoicePool/standardCalInvoicePool",
				type: "get",
				data: {
					nsrsbh : nsrsbh,
					etrName : etrName
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var calInvoicePoolResult = data.dataBody.calInvoicePoolResult;
						$("#fpcje").val(calInvoicePoolResult.amount).attr("readOnly","readOnly");
						$("#fpczs").val(calInvoicePoolResult.count).attr("readOnly","readOnly");
						$("#fpcjes").text(calInvoicePoolResult.amount+"元");
						$("#fpczss").text(calInvoicePoolResult.count+"张");
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
		//初审
		disclosedFactoring : function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringPlatformHandleStatus",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$.jBox.success("提交成功","提示");
						loanDetail.getPlatformHandleResult(dataList.applyNo);
						if(productType == "CRZ"){
							loanDetail.standardCalInvoice(unionCode, etrName);
						}
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
				url: "/apply/getDisclosedFactoringPlatformHandleResult",
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
						if(productType == "CRZ"){
							$(".crzpf").show();
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
				url: "/apply/getDisclosedFactoringFinancialOrgHandleResult",
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
						if(productType == "MBL"){
							$("#blzy").text("保理合同模板");
						}else{
							$("#blzy").text("质押合同模板");
						}
						//融资
						$.each(list.financialContractFileList,function(i,item){
							var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
	            	        if(fileExt == ".jpg" || fileExt == ".png"){
	            	        	itype = "image";
	            	        }else if(fileExt == ".pdf"){
	            	        	itype = "pdf";
	            	        }else{
	            	        	itype = "word";
	            	        } 
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
							$("#rzhtmb").html(str);
						})
						if(list.factoringContractFileList){
							$("#blht").show();
							//保理
							$.each(list.factoringContractFileList,function(i,item){
								var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
		            	        if(fileExt == ".jpg" || fileExt == ".png"){
		            	        	itype = "image";
		            	        }else if(fileExt == ".pdf"){
		            	        	itype = "pdf";
		            	        }else{
		            	        	itype = "word";
		            	        } 
								var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
								$("#blhtmb").html(str);
							})
						}
						if(list.factoringContractFileList){
							$("#zyht").show();
							//质押
							$.each(list.factoringContractFileList,function(i,item){
								var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
		            	        if(fileExt == ".jpg" || fileExt == ".png"){
		            	        	itype = "image";
		            	        }else if(fileExt == ".pdf"){
		            	        	itype = "pdf";
		            	        }else{
		            	        	itype = "word";
		            	        } 
								var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
								$("#zyhtmb").html(str);
							})
						}	
						if(list.noticeFileList){
							//通知函
							$.each(list.noticeFileList,function(i,item){
								var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
		            	        if(fileExt == ".jpg" || fileExt == ".png"){
		            	        	itype = "image";
		            	        }else if(fileExt == ".pdf"){
		            	        	itype = "pdf";
		            	        }else{
		            	        	itype = "word";
		            	        } 
								var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
								$("#tzhmb").html(str);
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
		/*明保理：获取应收账款转让通知书*/
	    getNotice:function(applyNo){
			$.ajax({
				url: "/apply/getDisclosedFactoringNotice",
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
						var noticeFileList = data.dataBody.noticeFileList;
						$.each(noticeFileList,function(i,item){
							var fileExt = item.fileRealName.substr(item.fileRealName.indexOf("."));
	            	        if(fileExt == ".jpg" || fileExt == ".png"){
	            	        	itype = "image";
	            	        }else if(fileExt == ".pdf"){
	            	        	itype = "pdf";
	            	        }else{
	            	        	itype = "word";
	            	        } 
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-'+itype+'-o"></i>'+item.fileRealName+'</a>';
							$("#yszzrs").append(str);
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
		/*获取买方审核结果*/
		getPurchaserResult:function(applyNo){
			$.ajax({
				url: "/apply/getDisclosedFactoringPurchaserHandleResult",
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
						var arr = list.purchaserOpinion.split(':');
						list.opinion = arr[1];
						var source   = $("#applyFive-template").html();
						var template = Handlebars.compile(source);
						$("#applyfive").html(template(list));
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
				url: "/apply/getDisclosedFactoringFinancialOrgFinalHandle",
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
						var arr = list.purchaserOpinion.split(':');
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
			$("#csform").validate({
				debug: true,
				rules: {
					adviseLoanAmount: {
				      	required: true,
				      	number:true,
				      	max: loanAmount,
				      	maxlength: 11,
				      	positiveinteger: true,
				    },
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
			    	adviseLoanAmount: {
			      		required: "请输入建议融资额度",
			      		number : "请输入有效数字", 
			      		max: "建议融资金额不能大于意向融资金额",
			      		maxlength: "建议融资额度长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
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
				var data = {
					applyNo: applyNo,
					adviseRepayWay : $("#adviseRepayWay").val(),	
					adviseLoanTerm : $("#adviseLoanTerm").val(),	
					adviseLoanAmount : $("#adviseLoanAmount").val(),	
					adviseLoanRate : $("#adviseLoanRate").val(),
					statusCode : $("#status").val(),
					opinion: $("#opinion").val(),
				}
				loanDetail.disclosedFactoring(data);
			}
		}else if($("#status").val() == "PTJJ"){
			var data = {};
			if($("#adviseRepayWay").val() != ""){
				data.adviseRepayWay = $("#adviseRepayWay").val();
			}
			if($("#adviseLoanTerm").val() != ""){
				data.adviseLoanTerm = $("#adviseLoanTerm").val();
			}
			if($("#adviseLoanAmount").val() != ""){
				data.adviseLoanAmount = $("#adviseLoanAmount").val();
			}
			if($("#adviseLoanRate").val() != ""){
				data.adviseLoanRate = $("#adviseLoanRate").val();
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
	   var aint=parseInt(value.toString());	
	   console.log(aint,value)
	    return aint>0&& (aint+"")==value;   
	 }, "Please enter a valid number."); 
}) 