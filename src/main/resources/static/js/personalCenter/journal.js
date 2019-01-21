(function($) {
	window.roleList = null;
	window.management = $.fn.management = {
		//从字典表获取用户机构职位
	    getUserOrgTitleList:function(type){
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{
					type:type
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.dictionaryList;
						roleList = list;
						
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
			});
		},
		/*获取日志列表*/
		getList:function(goPageNum){
			$.jBox.tip("加载中...！", "loading");
			var orgName = $("#orgName").val(),
				account = $("#account").val(),
				startDate = $("#startDate").val(),
				endDate = $("#endDate").val()
			$.ajax({
				url: "/sysOperationLog/getSysOperationLogByCondition",
				type: "get",
				data: {
					orgName:orgName,
					account:account,
					startDate:startDate,
					endDate:endDate,
					pageNum:goPageNum
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var sysOperationLogList = data.dataBody.sysOperationLogList,
							total = data.dataBody.totalNum;
						var source   = $("#rz-template").html();
						var template = Handlebars.compile(source);
						$.each(sysOperationLogList,function(i,item){
							$.each(roleList,function(v,val){
								if(item.orgType == val.value){
									item.orgType = val.optionText;
								}
							})
							item.ind = i+1+((goPageNum-1)*10);//序号
						})
						$("#rz-table").html(template(sysOperationLogList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							management.setPage(goPageNum, Math.ceil(total/10), management.getList)
						}else{
							$("#pagination").hide();
							$("#rz-table").html("<tr class='text-center'><td colspan=7>暂无数据</td></tr>");
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
	    	management.getList(page);
	    }
	}
	
})(jQuery);

$(document).ready(function($){
	management.getUserOrgTitleList("orgType");
	management.getList(1);
	//注册索引+1的helper
	var handleHelper = Handlebars.registerHelper("addOne",function(index){
		//返回+1之后的结果
		return index+1;
	});
})