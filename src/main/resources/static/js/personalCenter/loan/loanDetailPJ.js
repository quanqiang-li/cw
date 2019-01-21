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

						if(productType == "PJTX"){
							$(".pjtxshow").show();
						}else{
							$(".pjzyshow").show();
							$("#rzxx").show();
						}
						loanDetail.getNotesInfoByApplyNo(applyList[0].applyNo);
						//判断申请状态
						if(applyList[0].statusCode != "ZLBC"){
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
										$("#submit").hide();
										$("#wdht").show();
										loanDetail.getPdfApplyContractList();
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
		/*获取金融机构用户 最终处理*/
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
							$.jBox.success("合同签署成功","提示");
							$("#submit").hide();
							$("#wdht").show();
							loanDetail.getPdfApplyContractList();
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
						$("#wdhttab").html(str);
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