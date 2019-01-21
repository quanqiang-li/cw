(function($) {
	window.Orglist = [];
	window.userType = null;
	window.loan = $.fn.loan = {
		/*获取申请列表*/
		getList:function(datalist){
			$.ajax({
				url: "/apply/getApplyInfoByCondition",
				type: "get",
				data: datalist,
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var applyList = data.dataBody.applyList,
							total = data.dataBody.totalNum;
						$.each(applyList,function(i,item){
							if(Orglist.length>0){
								$.each(Orglist,function(v,val){
									if(item.orgCode == val.code){
										if(!val.logo){
											val.logo = "/static/img/guanliyuan.png";
										}
										item.logo = val.logo;
									}
								})
							}
						})
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$("#orderList").html(template(applyList));
						$.jBox.closeTip();
						if(total>0){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							loan.setPage(datalist, Math.ceil(total/10), loan.getList)
						}else{
							$("#pagination").hide();
							$("#orderList").html("<p class='text-center lineh-100'>暂无数据</p>");
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
	                callback && callback(datalist);
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
	    	loan.getList(data);
	    },
	    search:function(){
	    	var etrName, unionCode,data = {},status = [];
	    	if($("#etrName").val()){
	    		if(escape( $("#etrName").val() ).indexOf("%u") < 0) {
		    		data.unionCode = $("#etrName").val();
				} else {
					data.etrName = $("#etrName").val();
				}
	    	}
	    	$("#checkBox input[type=checkbox]").each(function(){
	    		if($(this).is(":checked")){
	    			status.push($(this).val());
	    		}
	    	})
	    	if(status.length>0){
	    		data.statusCode = status.join(",");
	    	}
	    	if($("#productName").val()){
	    		data.productName = $("#productName").val();
	    	}
	    	if($("#order").val()){
	    		data.applyNo = $("#order").val();
	    	}
	    	if($("#startDate").val()){
	    		data.startDate = $("#startDate").val();
	    	}
	    	if($("#endDate").val()){
	    		data.enDate = $("#endDate").val();
	    	}
	    	data.pageNum = "1";
	    	loan.getList(data);
	    },
	    toloanDetail:function(applyNo,productType){
	    	if(userType == "3"){
	    		if(productType == "PJTX" || productType == "PJZY"){
	    			location.href = "loanDetailOrgPJ.html?applyNo="+applyNo;
	    		}else{
		    		location.href = "loanDetailOrg.html?applyNo="+applyNo;
	    		}
	    	}else if(userType == "5"){
	    		if(productType == "PJTX" || productType == "PJZY"){
	    			location.href = "loanDetailSysPJ.html?applyNo="+applyNo;
	    		}else{
	    			location.href = "loanDetailSys.html?applyNo="+applyNo;
	    		}
	    	}
	    	
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
						$.each(list,function(i,item){
							Orglist.push({logo:item.logo,name:item.name,code:item.code});
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
	}
	
})(jQuery);

$(document).ready(function($){
	if(window.localStorage.getItem("user")){
    	var user = window.localStorage.getItem("user");
    		userType = JSON.parse(user).type;
		if(userType == "3"){
			$(".zdshow").hide();
		}else if(userType == "5"){
			$(".zdshow").show();
		}
    }
	var data = {
		pageNum : "1"	
	}
	loan.getOrgList();
	loan.getList(data);
})