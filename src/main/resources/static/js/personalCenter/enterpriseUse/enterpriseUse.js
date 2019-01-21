(function($) {
	window.roleList = null;
	window.enterpirseUse = $.fn.enterpirseUse = {
		/*获取企业用户列表*/
		getAllUserList:function(goPageNum,etrName,unionCode,realName,mobile){
			$.jBox.tip("加载中...！", "loading");
			$.ajax({
				url: "/user/getAllEtrUserInfoByCondition",
				type: "get",
				data: {
					pageNum:goPageNum,
					etrName:etrName,
					unionCode:unionCode,
					realName:realName,
					mobile:mobile
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var userEtrInfoList = data.dataBody.userEtrInfoList,
							total = data.dataBody.totalNum;
						$.each(userEtrInfoList,function(i,item){
							$.each(roleList,function(v,val){
								if(item.role == val.value){
									item.role = val.optionText;
								}
							})
						})
						var source   = $("#rz-template").html();
						var templates = Handlebars.compile(source);
						$("#rz-table").html(templates(userEtrInfoList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							enterpirseUse.setPage(goPageNum, Math.ceil(total/10), enterpirseUse.getAllUserList)
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
	    	enterpirseUse.getAllUserList(page);
	    },
	    //从字典表获取用户机构职位
	    getUserOrgTitleList:function(type){
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{"type":type},
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
	}
})(jQuery);

$(document).ready(function($){
	enterpirseUse.getUserOrgTitleList("userOrgTitle");
	enterpirseUse.getAllUserList(1);
	$("#query").click(function(){
		var etrName = $("#etrName").val();
		var unionCode = $("#unionCode").val();
		var realName = $("#realNameEtr").val();
		var mobile = $("#mobile").val();
		enterpirseUse.getAllUserList(1,etrName,unionCode,realName,mobile);
	});
})