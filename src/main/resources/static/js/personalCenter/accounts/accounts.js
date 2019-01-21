(function($) {
	window.dataSearch = {
		pageNum:1	
	},
	window.accounts = $.fn.accounts = {
		/*获取待确认账款*/
		getList:function(datalist){
			$.jBox.tip("加载中...！", "loading");
			$.ajax({
				url: "/apply/getAllMblPurchaserApply",
				type: "get",
				data: datalist,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var goPageNum = Number(datalist.pageNum);
						var mblApplyResultVoList = data.dataBody.mblPurchaserApplyResultVoList,
							total = data.dataBody.totalNum;
						$.each(mblApplyResultVoList,function(i,item){
							item.ind = i+1+((goPageNum-1)*10);//序号
							if(item.applyStatusCode == "QSHT"){
								item.qrsz = true;
							}
							
						})
						
						var source   = $("#rz-template").html();
						var template = Handlebars.compile(source);
						
						$("#rz-table").html(template(mblApplyResultVoList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							accounts.setPage(datalist, Math.ceil(total/10), accounts.getList)
						}else{
							$("#pagination").hide();
							$("#rz-table").html("<tr class='text-center'><td colspan=9>暂无数据</td></tr>");
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
		/*分页*/
		setPage :function(datalist, pageSum, callback) {
	        $(".pagination").bootstrapPaginator({
	            //设置版本号
	            bootstrapMajorVersion: 3,
	            // 显示第几页
	            numberOfPages:5, //最多显示Page页
	            currentPage: datalist.pageNum,
	            // 总页数
	            totalPages: pageSum,
	            itemTexts: function(type, page, current) {
					switch(type) {
						case "first": // type值固定
							return '首页';
						case "prev":
							return '上一页';
						case "next":
							return '下一页';
						case "last":
							return '末页';
						case "page":
							return page;
					}
				},
	            //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
	            onPageClicked: function (event,originalEvent,type,page) {
	                // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
	            	datalist.pageNum = page;
	                callback && callback(datalist)
	            }
	        })
	    },
	    showPage :function(){
	    	var page = $("#topage").val();
	    	if(page == "" || page<1){
	    		page = 1;
	    	}else if(page >= Math.ceil($("#total").text()/10)){
	    		page = Math.ceil($("#total").text()/10);
	    	}
	    	var data = {
	    		pageNum : page	
	    	}
	    	accounts.getList(data);
	    },
	    search:function(){
			var financialOrgCode = $("#orgName").val(),
				creditor = $("#creditor").val(),
				startDate = $("#startDate").val(),
				endDate = $("#endDate").val();
				dataSearch = {};
	    	if(financialOrgCode != ""){
	    		dataSearch.financialOrgCode = financialOrgCode;
	    	}
	    	if(creditor != ""){
	    		dataSearch.creditor = creditor;
	    	}
	    	if(startDate != ""){
	    		dataSearch.startDate = startDate;
	    	}
	    	if(endDate != ""){
	    		dataSearch.endDate = endDate;
	    	}
	    	dataSearch.pageNum = "1";
	    	accounts.getList(dataSearch);
	    },
	    /*获取在线产品的机构列表*/
		getOrgList:function(){
			$.ajax({
				url: "/product/getProductOrg",
				type: "get",
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.productOrg;
						var html = "<option value=''>请选择办理银行/机构</option>";
						$.each(list,function(i,item){
							html += "<option value="+item.code+">"+item.name+"</option>";
						})
						$("#orgName").html(html);
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
	    /*详情页*/
	    toDetail : function(applyNo){
	    	location.href = "accountsDetail.html?applyNo="+applyNo;
	    },
	    /*同意*/
		toAgree : function(applyNo){
			var data = {
				applyNo: applyNo,
				statusCode : "TZHTG",
				opinion: "同意",
			}
			accounts.disclosedFactoring(data);
		},
	    /*拒绝*/
		toRefuse : function(applyNo){
			var data = {
				applyNo: applyNo,
				statusCode : "TZHJJ",
				opinion: "拒绝",
			}
			accounts.disclosedFactoring(data);
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
						accounts.getList(dataSearch);
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
	    
	}
	
})(jQuery);

$(document).ready(function($){
	accounts.getOrgList();
	accounts.getList(dataSearch);
	
	//注册索引+1的helper
	var handleHelper = Handlebars.registerHelper("addOne",function(index){
		//返回+1之后的结果
		return index+1;
	});
})