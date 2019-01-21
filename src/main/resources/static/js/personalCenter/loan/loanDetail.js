(function($) {
	window.productType = null;
	window.applyId = null;
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
						productType = applyList[0].productType;
						applyId = applyList[0].id;
						var source   = $("#applyList-template").html();
						var template = Handlebars.compile(source);
						$("#myTabContent").prepend(template(applyList[0]));
						
						//判断申请状态
						if(applyList[0].statusCode != "ZLBC"){
							if(applyList[0].productType != "CRZ"){
								$("#yszk").show();
								loanDetail.getAccount(applyList[0].applyNo);
								loanDetail.getApplyFile(applyList[0].applyNo);
							}
							//平台审核
							if(applyList[0].statusCode != "YHSQ" && applyList[0].statusCode != "FKTG" && applyList[0].statusCode != "FKJJ"){
								$("#pttg").show();
								loanDetail.getPlatformHandleResult(applyList[0].applyNo);
								if(applyList[0].statusCode != "PTJJ"){
									$("#status").html("通过");
								}else{
									$("#status").html("拒绝");
								}
								//金融机构审核
								if(applyList[0].statusCode != "PTJJ" && applyList[0].statusCode != "PTTG"){
									$("#jrjgtg").show();
									loanDetail.getPlatformHandleOrgResult(applyList[0].applyNo);
									if(applyList[0].statusCode != "JRJGJJ"){
										$("#permitstauts").html("通过");
									}else{
										$("#permitstauts").html("拒绝");
									}
									//签署合同
									if(applyList[0].statusCode != "JRJGJJ" && applyList[0].statusCode != "JRJGTG"){	
										$("#wdht").show();
										$("#submit").hide();
										loanDetail.getPdfApplyContractList();
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
												if(applyList[0].statusCode != "TZHTG" && applyList[0].statusCode != "TZHJJ"){
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
						$("#applysix").html(template(list));
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
		/*查看合同*/
		toContract : function(id){
			window.open("/static/html/personalCenter/loan/templateView.html?templateId="+id+"&applyId="+applyId);
		},
		/*签署合同*/
		signContract:function(){
			$.jBox.tip("签署中...", "loading");
			$.ajax({
				url: "/applyContract/signContract",
				type: "get",
				data: {
					applyId : applyId,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						if(data.dataBody.fileCount){
							var fileCount = data.dataBody.fileCount;
							$.jBox.success("合同签署成功","提示");
							$("#submit").hide();
							$("#wdht").show();
							loanDetail.getPdfApplyContractList();
							if(productType == "MBL"){
								loanDetail.createPurchaser();
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
		/*开通买方账户*/
		createPurchaser:function(){
			$.ajax({
				url: "/apply/openPurchaserAccount",
				type: "post",
				data: {
					applyNo : util.request("applyNo"),
				},
				dataType: "json",
				cache:false,
				success : function(data){
					console.log(data);
				},
				error: function (data) {
					//$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		/*获取签署合同*/
		getPdfApplyContractList:function(){
			$.ajax({
				url: "/applyContract/getPdfApplyContractList",
				type: "get",
				data: {
					applyId : applyId,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var listFile = data.dataBody.listFile,
							str = "<h2 class='orgtitle'>合同下载</h2>";
						$.each(listFile,function(i,item){
							str +='<div class="form-group">'
								+'<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-pdf-o"></i>'+item.fileRealName+'</a>'
								+'</div>'
								+'<div class="clear"></div>';
						})
						$("#wdhttab").html(str)
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
	loanDetail.getApplylist();
}) 