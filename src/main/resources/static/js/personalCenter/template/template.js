(function($) {
	window.identification=null;
	window.templateTypeList=null;
	window.dicPage=1;
	window.orgId=null;
	window.template = $.fn.template = {
		/*获取日志列表*/
		getList:function(goPageNum,orgId){
			$.ajax({
				url: "/contractTemplate/getOrgContractTemplateList",
				type: "get",
				data: {
					pageNum:goPageNum,
					orgId:orgId
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var sysAttachedFileList = data.dataBody.listContractTemplate,
							total = data.dataBody.totalNum;
						$.each(sysAttachedFileList,function(i,item){
							$.each(templateTypeList,function(k,val){
								if(item.templateType == val.value){
									item.templateType = val.optionText;
								}
							});
						});
						var source = $("#rz-template").html();
						var templates = Handlebars.compile(source);
						$("#rz-table").html(templates(sysAttachedFileList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							template.setPage(goPageNum, Math.ceil(total/10), template.getList)
						}else{
							$("#pagination").hide();
							$("#rz-table").html("<tr class='text-center'><td colspan=5>暂无数据</td></tr>");
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
	                callback && callback(page,orgId)
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
	    	template.getList(page,orgId);
	    },
	    /* 获取用户信息 */
		getUsermeg: function(){
			$.ajax({
				url: "/user/getLoginInfo",
				type: "get",
				cache: false,
				aysnc: false,
				dataType:'json',
				success : function(data){
					if(data.errorCode == "0"){
						identification= JSON.parse(data.dataBody.loginInfo).currentOrg.id;
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");	
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						window.localStorage.clear();
						setTimeout(function(){location.href = "/static/html/index.html"},1000);
						$.jBox.tip (data.errorString, "提示");
					}
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
	            }
			})
		},
		//从字典表获取合同模板类型
	    getTemplateTypeList:function(type){
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data:{
					type: type,
					pageSize: 200
				},
				dataType: "json",
				cache:false,
				async: false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var list = data.dataBody.dictionaryList;
						templateTypeList = list;
						$("#templateTypeList").html("<option value=''>请选择模板类型</option>");
						$.each(list,function(i,item){
							var $option = $("<option>").text(item.optionText);
							$option.attr("value",item.value);
							$("#templateTypeList").append($option);
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
			});
		},
		getTemplateVarialbeList:function(){
			$.ajax({
				url: "/contractTemplate/getContractTemplateVarialbe",
				type: "get",
				data:{
					pageSize: 200
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var list = data.dataBody.dictionaryList;
						var contentArr = [];
						$.each(list,function(i,item){
							contentArr.push( item.optionText+ "："+item.value )          
						})
						// 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
					    editor.customConfig.emotions = [
					        {
					            // tab 的标题
					            title: '模板变量',
					            // type -> 'emoji' / 'image'
					            type: 'emoji',
					            // content -> 数组
					            content: contentArr
					        }
					    ]
					     editor.create()
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
	    /*点击文件*/
	    createTemplate:function(templateData){
	    	$.ajax({
                url :'/contractTemplate/add',
                type : 'POST',
                data : templateData,
                async : false,
                cache : false,
                success : function(data) {
                    if (data.errorCode == "0") {
                        $.jBox.tip("上传成功");
                        template.getList(1,templateData.orgId);
                    }else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					} else {
                        $.jBox.tip(data.errorString);
                    }
                	$("#templateName").val("");
					$("#templateTypeList").val("");
					editor.txt.html("");
                    $('#templateModal').modal('hide');
                },
				error:function(){
					$.jBox.tip("服务器异常，请稍后重试。");
				}
            });
		},
		
	  //点击下一步验证表单
		validateForm : function(){
			$("#addTemplate").validate({
				debug: true,
				rules: {
					templateName: "required",
					templateTypeList: "required"
				},
			    messages: {
			    	templateName: "请输入模板名称",
			    	templateTypeList: "请选择模板类型"
			    }
			});			
		},
		editTemplate:function(){
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
			$("#templateModal").modal("show");
			$("#saveFooter").hide();
			$("#editFooter").show();
			$.ajax({
				url: "/contractTemplate/getContractTemplateById",
				type: "get",
				data: {
					id:arr[0]
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var contractTemplate = data.dataBody.contractTemplate;
						$("#templateName").val(contractTemplate.templateName);
						$("#templateTypeList").val(contractTemplate.templateType)
						editor.txt.html(contractTemplate.content);
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
		updateTemplate:function(dataList){
			$.ajax({
				url: "/contractTemplate/update",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("修改成功","提示");
						template.getList(dicPage,dataList.orgId);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
					}
					$("#templateName").val("");
					$("#templateTypeList").val("");
					editor.txt.html("");
					$('#templateModal').modal('hide');
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
				}
			});
		},
		deleteTemplate:function(orgId){
			var arr = new Array();
			$("input[type=checkbox]:checked").each(function(i){
				arr[i] = $(this).val();
			});
			if(arr.length == 0){
				$.jBox.tip("请选择一个模板");
				return;
			}
			if(arr.length>1){
				$.jBox.tip("每次只能选择一个模板");
				return;
			}
			$.ajax({
				url: "/contractTemplate/delete",
				type: "post",
				data: {
					id:arr[0]
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("删除成功","提示");
						template.getList(1,orgId);
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
		}
	}
})(jQuery);

$(document).ready(function($){
	var user = JSON.parse(window.localStorage.getItem("user"));
	orgId = user.id;
	template.getTemplateTypeList("contractTempFileType");
	template.getList(1,user.id);
	template.validateForm();
	template.getUsermeg();
	template.getTemplateVarialbeList();
	$("#orgName").val(user.name);
	$("#save").click(function(){
		console.log(editor.txt.html());
		if(editor.txt.html() == '<p><br></p>'){
			$.jBox.tip ("请输入模板内容", "提示");
			return false;
		}
		if($("#addTemplate").valid() == true){
			var data = {
				orgId: user.id,
				templateType: $("#templateTypeList").val(),
				templateName:$("#templateName").val(),
				content: editor.txt.html()
			}
			template.createTemplate(data);
		}
			
	});
	$("#update").click(function(){
		console.log($("input[type=checkbox]:checked").val());
		if($("#addTemplate").valid() == true){
			var data = {
				id:$("input[type=checkbox]:checked").val(),
				templateName: $("#templateName").val(),
				templateType:$("#templateTypeList").val(),
				content:editor.txt.html(),
				orgId:orgId
			}
			template.updateTemplate(data);
		}
			
	});
	$("#del").click(function(){
		template.deleteTemplate(user.id);
	});
	$("#edit").click(function(){
		template.editTemplate();
	});
	$("#add").click(function(){
		$("#templateModal").modal("show");
		$("#saveFooter").show();
		$("#editFooter").hide();
	});
})