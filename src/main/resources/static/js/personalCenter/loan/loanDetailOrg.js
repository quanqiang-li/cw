(function($) {
	window.applyNo = null;
	window.productType = null;
	window.orgId = null;
	window.etrName = null;
	window.applyId = null;
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
						applyId = applyList[0].id;
						loanAmount = applyList[0].loanAmount;
						var source   = $("#applyList-template").html();
						var template = Handlebars.compile(source);
						$("#myTabContent").prepend(template(applyList[0]));
						
						if(applyList[0].productType == "MBL"){
							$("#tzhmbl").show();
							$("#blzy").text("保理合同模板");
						}else{
							$("#tzhmbl").hide();
							$("#blzy").text("质押合同模板");
						}
						
						if(applyList[0].productType != "CRZ"){
							$("#yszk").show();
							loanDetail.getAccount(applyList[0].applyNo);
							loanDetail.getApplyFile(applyList[0].applyNo);
						}else{
							loanDetail.standardCalInvoice(applyList[0].unionCode,applyList[0].etrName);
						}

						//平台通过
						loanDetail.getPlatformHandleResult(applyList[0].applyNo);
						loanDetail.getTemplate(orgId,applyList[0].productType);

						//金融机构审核
						if(applyList[0].statusCode != "PTTG" && applyList[0].statusCode != "PTJJ"){
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
										if(applyList[0].statusCode != "TZHJJ"){
											$("#jgzs").show();
											if(applyList[0].statusCode != "TZHTG"){
												loanDetail.getDisclosedFactoring(applyList[0].applyNo);
												if(applyList[0].statusCode !="WSX"){
													$("#orgstauts").html("通过");
												}else{
													$("#orgstauts").html("拒绝");
												}
											}	
										}
									}
								}else{
									$("#jgzs").show();
									//金融机构终审
									if(applyList[0].statusCode != "QSHT" ){
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
						loanDetail.zsvalidateForm();
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
	    getAccount:function(applyNo,productType){
			$.ajax({
				url: "/apply/getDisclosedFactoringAccountsReceivableInfoByApplyNo",
				type: "get",
				data: {
					applyNo: applyNo,
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
						$("#applytwo").html(template(accountsReceivable));
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
						if(list.financialContractFileList){
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
						}
						if(list.factoringContractFileList){
							//保理 或 质押
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
		/*机构审批*/
		disclosedFactoring : function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringFinancialOrgHandle",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$.jBox.success("提交成功","提示");
						
						loanDetail.getPlatformHandleOrgResult(dataList.applyNo);
						if(dataList.statusCode !="JRJGJJ"){
							$("#permitstauts").html("通过");
						}else{
							$("#permitstauts").html("拒绝");
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
		/*机构终审*/
		disclosedFactoringZS : function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringFinancialFinalHandle",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$.jBox.success("提交成功","提示");
						loanDetail.getDisclosedFactoring(dataList.applyNo);
						if(dataList.statusCode !="WSX"){
							$("#orgstauts").html("通过");
						}else{
							$("#orgstauts").html("拒绝");
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
		/*上链*/
		uplodad : function(datalist){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/blockChainApi/uplodad",
				type: "post",
				data: {
					applyNo: datalist.applyNo
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						loanDetail.disclosedFactoringZS(datalist);
					}else{
						$.jBox.tip (data.errorString, "提示");
					}
				},
				error: function (data) {
					
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
		/*明保理：获取金融机构模板*/
		getTemplate:function(orgId, productType){
			$.ajax({
				url: "/contractTemplate/getOrgContractTemplateList",
				type: "get",
				data: {
					pageSize: 500,
					orgId : orgId,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					var templateList = data.dataBody.listContractTemplate,
						html = "";
					$.each(templateList,function(i,item){
						if(productType == "MBL"){
							if(item.templateType == "F007"){
								//明保理 融资合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#financialContractId").append(html);
							}
							if(item.templateType == "F008"){
								//明保理 保理合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#factoringContractId").append(html);
							}
							if(item.templateType == "F009"){
								//明保理 通知函模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#noticeId").append(html);
							}
						}else if(productType == "ABL"){
							if(item.templateType == "F016"){
								//暗保理 融资合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#financialContractId").append(html);
							}
							if(item.templateType == "F017"){
								//暗保理 质押合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#factoringContractId").append(html);
							}
						}else if(productType == "YSZKZY"){
							if(item.templateType == "F023"){
								//应收账款质押 融资合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#financialContractId").append(html);
							}
							if(item.templateType == "F024"){
								//应收账款质押 质押合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#factoringContractId").append(html);
							}
						}else if(productType == "CRZ"){
							if(item.templateType == "F027"){
								//池融资 融资合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#financialContractId").append(html);
							}
							if(item.templateType == "F028"){
								//池融资 质押合同模板
								html = "<option value="+item.id+">"+item.templateName+"</option>";
								
								$("#factoringContractId").append(html);
							}
						}
							
					})
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
		zsvalidateForm : function(){
			$("#zsform").validate({
				debug: true,
				rules: {
					zscz: "required",
					zsopinion: {
			      		required: true,
			      		maxlength: 200,
			      	}
				},
			    messages: {
			    	zscz: "请选择操作",
			    	zsopinion: {
			      		required: "请输入审批",
			      		maxlength: "审批内容长度不能大于200个字符"
			      	}
			    }
			});			
		},
		//点击下一步验证表单
		validateForm : function(){
			$("#csform").validate({
				debug: true,
				rules: {
					permitLoanAmount: {
				      	required: true,
				      	number:true,
				      	max: loanAmount,
				      	maxlength: 11,
				      	positiveinteger: true,
				    },
				    permitLoanTerm: {
				      	required: true,
				      	number:true,
				      	maxlength: 11,
				      	positiveinteger: true,
				    },
				    permitLoanRate: "required",
				    permitRepayWay: "required",
			      	status: "required",
			      	opinion: {
			      		required: true,
			      		maxlength: 200,
			      	},
			      	financialContractId: "required",
			      	factoringContractId: "required",
			      	noticeId: "required",
				},
			    messages: {
			    	permitLoanAmount: {
			      		required: "请输入融资金额",
			      		number : "请输入有效数字",
			      		max: "融资金额不能大于意向融资金额", 
			      		maxlength: "融资金额长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
			      	permitLoanTerm: {
			      		required: "请输入融资期限",
			      		number : "请输入有效数字", 
			      		maxlength: "融资期限长度不能大于11个字符",
			      		positiveinteger: "请输入大于0的整数"
			      	},
			      	permitLoanRate: "请输入建议融资利率上限",
			      	permitRepayWay: "请输入还款方式",
			      	status: "请选择操作",
			      	opinion: {
			      		required: "请输入审批",
			      		maxlength: "审批内容长度不能大于200个字符"
			      	},
			      	financialContractId: "请选择融资合同模板",
			      	factoringContractId: "请选择保理合同模板",
			      	noticeId: "请选择通知函模板",
			    }
			});			
		},
	}
	
})(jQuery);

$(document).ready(function($){
	var user = JSON.parse(window.localStorage.getItem("user"));
	orgId = user.id;
	
	loanDetail.getApplylist();
	$("#submit").click(function(){
		if($("#status").val() == "JRJGTG"){
			if($("#csform").valid() == true){
				var data = {
					applyNo: applyNo,
					permitLoanTerm : $("#permitLoanTerm").val(),	
					permitLoanAmount : $("#permitLoanAmount").val(),	
					permitLoanRate : $("#permitLoanRate").val(),	
					permitRepayWay : $("#permitRepayWay").val(),
					statusCode : $("#status").val(),
					opinion: $("#opinion").val(),
			      	financialContractId: $("#financialContractId").val(),
			      	factoringContractId: $("#factoringContractId").val(),
			      	noticeId: $("#noticeId").val(),
				}
				loanDetail.disclosedFactoring(data);
			}
		}else if($("#status").val() == "JRJGJJ"){
			var data = {};
			if($("#permitLoanTerm").val() != ""){
				data.permitLoanTerm = $("#permitLoanTerm").val();
			}
			if($("#permitLoanAmount").val() != ""){
				data.permitLoanAmount = $("#permitLoanAmount").val();
			}
			if($("#permitLoanRate").val() != ""){
				data.opinion = $("#permitLoanRate").val();
			}
			if($("#permitRepayWay").val() != ""){
				data.permitRepayWay = $("#permitRepayWay").val();
			}
			if($("#financialContractId").val() != ""){
				data.financialContractId = $("#financialContractId").val();
			}
			if($("#factoringContractId").val() != ""){
				data.factoringContractId = $("#factoringContractId").val();
			}
			if($("#noticeId").val() != ""){
				data.noticeId = $("#noticeId").val();
			}
			if($("#opinion").val() != ""){
				data.opinion = $("#opinion").val();
			}else{
				$.jBox.tip ("请输入批复", "提示");
				return false;
			}
			data.applyNo = applyNo;
			data.statusCode = $("#status").val();
			loanDetail.disclosedFactoring(data);
		}else{
			$.jBox.tip ("请选择操作", "提示");
		}
			
	})
	$("#zssubmit").click(function(){
		if($("#zsform").valid() == true){
			var data = {
				applyNo: applyNo,
				statusCode : $("#zscz").val(),
				opinion: $("#zsopinion").val(),
			}
		}
		if(data.statusCode == "YSX"){
			loanDetail.uplodad(data);
		}else if(data.statusCode == "WSX"){
			loanDetail.disclosedFactoringZS(data);
		}
		
	})
	
	//表单自定义正整数
	jQuery.validator.addMethod("positiveinteger", function(value, element) {
	   var aint=parseInt(value);	
	    return aint>0&& (aint+"")==value;   
	 }, "Please enter a valid number."); 
	//预览融资合同
	$("#rzhtView").click(function(){
		var templateId = $("#financialContractId").val();
		if(templateId != ''){
			window.open("/static/html/personalCenter/loan/templateView.html?templateId="+templateId+"&applyId="+applyId+"&type=preview");
		}else{
			$.jBox.tip ("请选择融资合同模板", "提示");
		}
	});
	//预览保理合同
	$("#blhtView").click(function(){
		var templateId = $("#factoringContractId").val();
		if(templateId != ''){
			window.open("/static/html/personalCenter/loan/templateView.html?templateId="+templateId+"&applyId="+applyId+"&type=preview");
		}else{
			$.jBox.tip ("请选择保理合同模板", "提示");
		}
	});
	//预览通知函
	$("#tzhView").click(function(){
		var templateId = $("#noticeId").val();
		if(templateId != ''){
			window.open("/static/html/personalCenter/loan/templateView.html?templateId="+templateId+"&applyId="+applyId+"&type=preview");
		}else{
			$.jBox.tip ("请选择通知函模板", "提示");
		}
	});
}) 