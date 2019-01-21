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
					statusCode: "ONLINE",
					orgCode:$("#orgCode a").attr("data-id"),
					productType:$("#productType a").attr("data-id"),
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var productList = data.dataBody.productList,
							total = data.dataBody.totalNum;
						$.each(productList,function(i,item){
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
						var source   = $("#product-template").html();
						var template = Handlebars.compile(source);
						$("#prodList").html(template(productList));
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
							$("#prodList").html("<p class='text-center lineh-100'>暂无数据</p>");
						}
						//点击产品到详情页
						$("#prodList").on("click",".Product",function(){
							location.href = "detail.html?id="+$(this).attr("data-id");
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
							var html = "<li data-id="+item.code+">"+item.name+"</li>";
							Orglist.push({logo:item.logo,name:item.name,code:item.code});
							$("#org").append(html);
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
		//根据条件获取字典表
		getDictionary:function(type,name){
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
							var html = "<li data-id="+item.value+">"+item.optionText+"</li>";
							$("#prodType").append(html);
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
		//选择条件
		screenCondition : function(){
			//点击条件
			$(".choice").on("click","li",function(){
				var text =$(this).text(),
					title = $(this).parents(".choice-area").find("h3").text(),
					ind = $(this).parents(".choice-area").index();	
				if(text != "不限"){
					id = $(this).attr("data-id");
					$("#selected div").eq(ind).html('<a href="javascript:;" data-id='+id+'><i>'+text+'</i><span class="fa fa-times"></span></a>');					
				}else{
					$("#selected div").eq(ind).html("");
				}
				$(this).addClass("pitch").siblings().removeClass("pitch");
				//条件筛选
				product.getList(1);
					
			})
			//点击已选条件删除
			$("#selected div").on("click","a",function(){
				var ind = $(this).parent().index();
				$(this).remove();
				$(".choice-area").eq(ind).find("li:eq(0)").addClass("pitch").siblings().removeClass("pitch");
				product.getList(1);
			})
			//点击清空
			$("#clearChoice").on("click",function(){
				$("#selected div").not(this).html("");
				$(".choice-area").find("li:eq(0)").addClass("pitch").siblings().removeClass("pitch");
				product.getList(1);
			})
			
		}
	}
})(jQuery);

$(document).ready(function($){
	//展示列表
	product.getOrgList();
	product.getList(1);
	product.getDictionary("productType","产品类型");
	//选择条件
	product.screenCondition();
})
	