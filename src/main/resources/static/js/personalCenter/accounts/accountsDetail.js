(function($) {
	window.applyNo = null;
	window.accounts = $.fn.accounts = {
		/*获取申请详情*/
		getApplylist:function(){
			$.ajax({
				url: "/apply/getApplyByApplyNo",
				type: "get",
				data: {
					applyNo : util.request("applyNo"),
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var applyList = data.dataBody.apply;
						applyNo = applyList.applyNo;
						var source   = $("#applyList-template").html();
						var template = Handlebars.compile(source);
						$("#myTabContent").prepend(template(applyList));
						
						accounts.getAccount(applyList.applyNo);
						accounts.getApplyFile(applyList.applyNo);
						accounts.getNotice(applyList.applyNo);
						if(applyList.statusCode == "QSHT" || applyList.statusCode == "TZHTG" || applyList.statusCode == "TZHJJ"|| applyList.statusCode == "YSX"|| applyList.statusCode == "WSX"){
							$(".qrzk").show();
							if(applyList.statusCode != "QSHT" ){
								accounts.getPurchaserResult(applyList.applyNo);
								if(applyList.statusCode !="TZHJJ"){
									$("#purchaserstauts").html("通过");
								}else{
									$("#purchaserstauts").html("拒绝");
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
		/*获取应收账款信息*/
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
							var str ='<a href="'+item.fileDownloadWebPath+'" class="filefj left"><i class="fa fa-file-pdf-o"></i>'+item.fileRealName+'</a>';
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
		/*明保理：买方处理 通过或未通过*/
		disclosedFactoring : function(dataList){
			$.jBox.tip("正在提交，请稍后...", 'loading');
			$.ajax({
				url: "/apply/disclosedFactoringPurchaserHandle",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$.jBox.success("提交成功","提示");
						accounts.getPurchaserResult(applyNo);
						if(dataList.statusCode !="TZHJJ"){
							$("#purchaserstauts").html("通过");
						}else{
							$("#purchaserstauts").html("拒绝");
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
						$("#qrtab").html(template(list));
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
		validateForm : function(){
			$("#zsform").validate({
				debug: true,
				rules: {
					zscz: "required",
					opinion: "required",
				},
			    messages: {
			    	zscz: "请选择操作",
			    	opinion: "请输入批复",
			    }
			});			
		},
	}
	
})(jQuery);

$(document).ready(function($){
	accounts.validateForm();
	accounts.getApplylist();
	
	$("#submit").click(function(){
		if($("#zsform").valid() == true){
			var data = {
				applyNo: applyNo,
				statusCode : $("#zscz").val(),
				opinion: $("#opinion").val(),
			}
			//console.log(data)
			accounts.disclosedFactoring(data);
		}
	})
}) 