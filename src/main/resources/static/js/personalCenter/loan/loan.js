(function($) {
	window.Orglist = [];
	window.loan = $.fn.loan = {
		/*获取申请列表*/
		getList:function(goPageNum){
			$.ajax({
				url: "/apply/getApplyInfoByCondition",
				type: "get",
				data: {
					pageNum:goPageNum,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var applyList = data.dataBody.applyList,
							total = data.dataBody.totalNum;
						$.each(applyList,function(i,item){
							if(item.statusCode == "ZLBC"){
								item.save = true;
							}
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
							loan.setPage(goPageNum, Math.ceil(total/10), loan.getList)
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
		setPage :function(pageCurrent, pageSum, callback) {
	        $(".pagination").bootstrapPaginator({
	            //设置版本号
	            bootstrapMajorVersion: 3,
	            // 显示第几页
	            numberOfPages:5, //最多显示Page页
	            currentPage: pageCurrent,
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
	                currentPage = page
	                callback && callback(page)
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
	    	loan.getList(page);
	    },
	    toloanDetail:function(applyNo,productType){
	    	console.log(productType)
	    	if(productType == "MBL" || productType == "ABL" || productType == "YSZKZY" || productType == "CRZ"){
		    	location.href = "loanDetail.html?applyNo="+applyNo;
	    	}else{
	    		location.href = "loanDetailPJ.html?applyNo="+applyNo;
	    	}
	    },
	    toPerfect:function(applyNo,productId,applyId,productType){
	    	if(productType == "MBL"){
	    		location.href = "/static/html/apply/MBL_BZ.html?id="+productId+"&applyNo="+applyNo+"&applyId="+applyId;
	    	}else if(productType == "ABL"){
	    		location.href = "/static/html/apply/ABL_BZ.html?id="+productId+"&applyNo="+applyNo+"&applyId="+applyId;
	    	}else if(productType == "YSZKZY"){
	    		location.href = "/static/html/apply/YSZKZY_BZ.html?id="+productId+"&applyNo="+applyNo+"&applyId="+applyId;
	    	}else if(productType == "PJTX"){
	    		location.href = "/static/html/apply/PJTX_BZ.html?id="+productId+"&applyNo="+applyNo+"&applyId="+applyId;
	    	}else if(productType == "PJZY"){
	    		location.href = "/static/html/apply/PJZY_BZ.html?id="+productId+"&applyNo="+applyNo+"&applyId="+applyId;
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
	loan.getOrgList();
	loan.getList(1);
	window.localStorage.removeItem("selectedInvoice");
	window.localStorage.removeItem("yszkData");
})