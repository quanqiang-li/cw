var searchName;
(function($) {
	window.dicPage=1;
	window.gylNode = $.fn.gylNode = {
		/*获取字典列表*/
		getNodeList:function(pageSize,goPageNum,orgCode){
			$.jBox.tip("加载中...！", "loading");
			$.ajax({
				url: "/blockChainAccount/query",
				type: "post",
				data: {
					PageSize:pageSize,
					currentPage:goPageNum,
					orgName:orgCode
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var nodeList = data.dataBody.accountList,
							total = data.dataBody.totalNum;
						var source   = $("#rz-template").html();
						var templates = Handlebars.compile(source);
						$("#rz-table").html(templates(nodeList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							gylNode.setPage(goPageNum, Math.ceil(total/10), gylNode.getNodeList)
						}
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
						return false;
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
	                callback && callback("",page,searchName)
	                dicPage=currentPage
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
	    	gylNode.getNodeList("",page,searchName);
	    },
	    /*点击保存*/
	    createGylNode:function(){
			var formData = new FormData($("#addGylNode")[0]);
			$.jBox.tip("上传中...！", "loading");
            $.ajax({
                url :'/blockChainAccount/create',
                type : 'POST',
                data : formData,
                async : false,
                cache : false,
                contentType : false,
                processData : false,
                success : function(data) {
                    if (data.errorCode == "0") {
            	    	gylNode.getNodeList("",1,searchName);
                    }else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					} else {
        				//$.jBox.closeTip();
                        $.jBox.tip(data.errorString);
                        return false;
                    }
                    $("#orgName").val("");
					$("#account").val("");
					$("#password").val("");
					$("#url").val("");
                    $('#gylNodeModal').modal('hide');
                    
                },
				error:function(){
					$.jBox.tip("服务器异常，请稍后重试。");
				}
            });
		},
		
	  //点击下一步验证表单
		validateForm : function(){
			$("#addGylNode").validate({
				debug: true,
				rules: {
					orgCode: "required",
					account: "required",
					password:"required",
					url:"required"
				},
			    messages: {
			    	orgCode: "请输入机构名称",
			    	account: "请输入机构账号",
			    	password:"请输入机构密码",
			    	url:"请输入机构地址"
			    
			    }
			});			
		},
		editGylNode:function(){
			var arr = new Array();
			$("input[type=checkbox]:checked").each(function(i){
				arr[i] = $(this).val();
			});
			if(arr.length == 0){
				$.jBox.tip("请选择一条数据");
				return;
			}
			if(arr.length>1){
				$.jBox.tip("每次只能选择一条数据");
				return;
			}
			$("#gylNodeModal").modal("show");
			$("#editFoot").show();
			$("#saveFoot").hide();
			$.ajax({
				url: "/blockChainAccount/query",
				type: "post",
				data: {
					orgName:arr[0]
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var editData = data.dataBody.accountList[0];
						$("#orgCode").val(editData.orgName);
						$("#account").val(editData.orgBlockChainAccount);
						$("#password").val(editData.orgBlockChainPassword);
						$("#url").val(editData.orgBlockChainUrl);
						$("#orgCodeHidden").val(editData.orgCode);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
						return false;
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
				}
			});
		},
		updateGylNode:function(data){
			$.ajax({
				url: "/blockChainAccount/save",
				type: "post",
				data: data,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("修改成功","提示");
				    	gylNode.getNodeList("",dicPage,searchName);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
						return false;
					}
					$("#orgCode").val("");
					$("#orgCodeHidden").val("");
					$("#account").val("");
					$("#password").val("");
					$("#url").val("");
					$('#gylNodeModal').modal('hide');
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
				}
			});
		},
		testConn : function(){
			var data = {
					orgBlockChainAccount: $("#account").val(),
					orgBlockChainPassword:$("#password").val(),
					orgBlockChainUrl:$("#url").val()
				}
			$.ajax({
				url: "/blockChainAccount/tryConnection",
				type: "post",
				data: data,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("测试成功","提示");
						gylNode.getNodeList("",dicPage,"");
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
						return false;
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
				}
			});
		}
		
	}
})(jQuery);

$(document).ready(function($){
	gylNode.getNodeList("",1,"");
	gylNode.validateForm();
	$("#save").click(function(){
		if($("#addGylNode").valid() == true){
			var data = {
				orgCode: $("#orgCode").val(),
				account: $("#account").val(),
				password:$("#password").val(),
				url:$("#url").val()
			}
			gylNode.createGylNode(data);
		}
			
	});
	$("#update").click(function(){
		if($("#addGylNode").valid() == true){
			var data = {
				orgCode: $("#orgCodeHidden").val(),
				orgBlockChainAccount: $("#account").val(),
				orgBlockChainPassword:$("#password").val(),
				orgBlockChainUrl:$("#url").val(),
			}
			gylNode.updateGylNode(data);
		}
			
	});
	$("#query").click(function(){
		var orgName = $("#orgName").val();
		if(orgName)
			searchName = orgName;
		else
			searchName = null;
		gylNode.getNodeList("",1,orgName);
	});
	$("#edit").click(function(){
		$("#orgCode").attr("readonly","true");
		gylNode.editGylNode();
	});
	$("#testConn").click(function(){
		gylNode.testConn();
	});
	$("#testConnUpdate").click(function(){
		gylNode.testConn();
	});
	$("#add").click(function(){
		$("#orgCode").removeAttr("readonly");
		$("#orgCode").val("");
		$("#orgCodeHidden").val("");
		$("#account").val("");
		$("#password").val("");
		$("#url").val("");
		$("#gylNodeModal").modal("show");
		$("#saveFooter").show();
		$("#editFooter").hide();
	});
})