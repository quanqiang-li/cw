(function($) {
	window.Orglist = [];
	window.product = $.fn.product = {
		/*获取产品列表*/
		getList:function(goPageNum){
			$.ajax({
				url: "/product/getProductPage",
				type: "get",
				data: {
					pageNum:goPageNum,
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var userList = data.dataBody.productList,
							total = data.dataBody.totalNum;
						$.each(userList,function(i,item){
							item.loanAmount = item.loanAmount/10000;
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
						$("#use-list").html(template(userList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							product.setPage(goPageNum, Math.ceil(total/10), product.getList)
						}else{
							$("#pagination").hide();
							$("#use-list").html("<p class='text-center lineh-100 bot tot'>暂无数据</p>");
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
	    	product.getList(page);
	    },
	    /*获取机构列表*/
		getOrgList:function(){
			$.ajax({
				url: "/financialOrg/getFinancialOrgList",
				type: "get",
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.financialOrgList;
						$.each(list,function(i,item){
							Orglist.push({logo:item.logo,name:item.name,code:item.code})
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
		/*跳转详情*/
	    toDetails:function(id){
	    	location.href = "productDetail.html?id="+id;
		}
	}
	
})(jQuery);

$(document).ready(function($){
	product.getOrgList();
	product.getList(1);
	/*点击跳转添加页面*/
	$("#add").on("click",function(){
		location.href="addsysAdmin.html";
	})
	/*点击查询*/
	$("#query").on("click",function(){
		if($.trim($("#mobile").val())){
			product.getList(1,$("#mobile").val());
		}else{
			product.getList(1);
		}
		
	})
})