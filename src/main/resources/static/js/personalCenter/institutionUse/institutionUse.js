(function($) {
	window.institution = $.fn.institution = {
		/*获取机构*/
		getOrgList:function(goPageNum,mobile){
			$.ajax({
				url: "/financialOrg/getFinancialOrgList",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.financialOrgList;
						$("#orgList").html("<option value='0'>请选择所属机构</option>");
						$.each(list,function(i,item){
							var $option = $("<option>").text(item.name);
							$option.attr("value",item.id);
							$option.attr("data-code",item.code);
							$("#orgList").append($option);
						})
						$("#orgList").change(function(){
							var val = $(this).val();
							if(val != 0){
								institution.getBranchList(val);
							}else{
								$("#orgfzList").html("<option value='0'>请选择分支机构</option>");
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
		},
		/*获取分支机构*/
		getBranchList:function(id){
			$.ajax({
				url: "/financialOrg/getAllBranchFinancialOrg",
				type: "get",
				data:{
					orgId: id
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.branchFinancialOrgList;
						$("#orgfzList").html("<option value='0'>请选择分支机构</option>");
						$.each(list,function(i,item){
							var $option = $("<option>").text(item.branchOrgName);
							$option.attr("value",item.branchOrgId);
							$("#orgfzList").append($option);
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
		/*获取机构用户*/
		getOrgUserList:function(goPageNum,mobile,code,orgPid){
			$.ajax({
				url: "/financialOrgUser/getFinancialOrgUserByCondition",
				type: "get",
				data:{
					orgCode:code,
					orgId:orgPid,
					mobile:mobile,
					pageNum:goPageNum
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.financialOrgUserResultList,
						total = data.dataBody.totalNum;
						var source   = $("#list-template").html();
						var template = Handlebars.compile(source);
						$.each(list,function(i,item){
							var branch = [];
							item.branchOrgDesc = item.branchOrgDesc.split(',');
							$.each(item.branchOrgDesc,function(v,val){
								var arr = val.split(':');
								branch.push(arr[1]);
							})
							item.branchOrg = branch.toString();
							if(item.isForbidden == "0"){
								item.isForbidden = "正常";
								item.isForbid = true;
							}else{
								item.isForbidden = "禁用";
								item.isForbid = false;
							}
						})
						$("#list").html(template(list));
						if(total>0){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							institution.setPage(goPageNum, Math.ceil(total/10), institution.getList)
						}else{
							$("#pagination").hide();
							$("#list").html("<p class='text-center lineh-100 bot tot'>暂无数据</p>");
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
	    	institution.getList(page);
	    },
		/*修改*/
		editUser:function(uuk,mobile,branchOrgDesc,code){
			var data = {
				branchOrgDesc:branchOrgDesc,
				mobile:mobile,
				uuk:uuk,
				code:code
			}
			window.localStorage.setItem("financialOrgUserResultList",JSON.stringify(data));
			location.href="addUseins.html?userId="+uuk;
		},
		/*禁用、删除机构用户*/
		financialUser:function(id,type){
			$.ajax({
				url: "/financialOrgUser/banFinancialOrgUserByUserid",
				type: "get",
				data: {
					userId: id,
					operationType: type
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						if(type == "del"){
							$.jBox.success("删除成功","提示");
						}else if(type == "ban"){
							$.jBox.success("禁用成功","提示");
						}else{
							$.jBox.success("恢复成功","提示");
						}
						institution.getOrgUserList(1);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.error(data.errorString,"提示");						
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		}
	}
	
})(jQuery);

$(document).ready(function($){
	institution.getOrgList();
	institution.getOrgUserList(1);
	/*点击查询*/
	$("#query").on("click",function(){
		var orgPid,code,mobile;
		if($("#orgList").val()>0 && $("#orgfzList").val()==0){
			code = $("#orgList").find("option:selected").attr("data-code");
		}else if($("#orgList").val()>0 && $("#orgfzList").val()>0){
			code = $("#orgList").find("option:selected").attr("data-code");
			orgPid = $("#orgfzList").val();
		}
		if($("#mobile").val() != ""){
			mobile = $("#mobile").val();
		}
		institution.getOrgUserList(1,mobile,code,orgPid);
	})
})