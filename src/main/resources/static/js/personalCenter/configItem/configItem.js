(function($) {
	window.dicPage=1;
	window.configItem = $.fn.configItem = {
		/*获取字典列表*/
		getDictionaryList:function(goPageNum,typeName){
			$.jBox.tip("加载中...！", "loading");
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data: {
					pageNum:goPageNum,
					typeName:typeName
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var dictionaryList = data.dataBody.dictionaryList,
							total = data.dataBody.totalNum;
						var source   = $("#rz-template").html();
						var templates = Handlebars.compile(source);
						$("#rz-table").html(templates(dictionaryList));
						$.jBox.closeTip();
						if(total){
							//分页
							if(total>10){
								$("#pageShow").show();
							}else{
								$("#pageShow").hide();
							}
							$("#total").text(total);
							configItem.setPage(goPageNum, Math.ceil(total/10), configItem.getDictionaryList)
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
	    	configItem.getDictionaryList(page);
	    },
	    /*点击保存*/
	    createDictionary:function(){
			var formData = new FormData($("#addDictionary")[0]);
			$.jBox.tip("上传中...！", "loading");
            $.ajax({
                url :'/dictionary/createNewDictionary',
                type : 'POST',
                data : formData,
                async : false,
                cache : false,
                contentType : false,
                processData : false,
                success : function(data) {
                    if (data.errorCode == "0") {
                        configItem.getDictionaryList(1);
                    }else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					} else {
        				//$.jBox.closeTip();
                        $.jBox.tip(data.errorString);
                    }
                    $('#dictionaryModal').modal('hide');
                    
                },
				error:function(){
					$.jBox.tip("服务器异常，请稍后重试。");
				}
            });
		},
		
	  //点击下一步验证表单
		validateForm : function(){
			$("#addDictionary").validate({
				debug: true,
				rules: {
					type: "required",
					typeName: "required",
					optionText:"required",
					innerOrder:"required"
				},
			    messages: {
			    	type: "请输入字典类型",
			    	typeName: "请输入类型名称",
			    	optionText:"请输入说明",
			    	innerOrder:"请输入内部排序"
			    
			    }
			});			
		},
		deleteDictionary:function(){
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
			$.ajax({
				url: "/dictionary/deleteDictionaryById",
				type: "post",
				data: {
					id:arr[0]
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("删除成功","提示");
						configItem.getDictionaryList(dicPage);
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
		editDictionary:function(){
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
			$("#dictionaryModal").modal("show");
			$("#editFoot").show();
			$("#saveFoot").hide();
			$.ajax({
				url: "/dictionary/getDictionaryInfoByCondition",
				type: "get",
				data: {
					id:arr[0]
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var editData = data.dataBody.dictionaryList[0];
						$("#type").val(editData.type);
						$("#typeName").val(editData.typeName);
						$("#labelText").val(editData.labelText);
						$("#value").val(editData.value);
						$("#optionText").val(editData.optionText);
						$("#innerOrder").val(editData.innerOrder);
						$("#enable").val(editData.enable);
						$("#type").attr("readonly","readonly");
						$("#typeName").attr("readonly","readonly");
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
		updateDictionary:function(data){
			$.ajax({
				url: "/dictionary/updateDictionaryById",
				type: "post",
				data: data,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("修改成功","提示");
						configItem.getDictionaryList(dicPage);
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.tip(data.errorString);
					}
					$('#dictionaryModal').modal('hide');
				},
				error: function (data) {
					$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
				}
			});
		}
		
	}
})(jQuery);

$(document).ready(function($){
	configItem.getDictionaryList(1);
	configItem.validateForm();
	$("#enable").html("<option value='0'>请选择</option>");
	var $option = $("<option>").text("是");
	$option.attr("value","YES");
	$("#enable").append($option);
	var $option1 = $("<option>").text("否");
	$option1.attr("value","NO");
	$("#enable").append($option1);
	$("#save").click(function(){
		if($("#addDictionary").valid() == true){
			var data = {
				type: $("#type").val(),
				typeName: $("#typeName").val(),
				optionText:$("#optionText").val(),
				value:$("#value").val(),
				innerOrder: $("#innerOrder").val(),
				enable:$("#enable").val()
			}
			configItem.createDictionary(data);
		}
			
	});
	$("#update").click(function(){
		console.log($("input[type=checkbox]:checked").val());
		if($("#addDictionary").valid() == true){
			var data = {
				id:$("input[type=checkbox]:checked").val(),
				type: $("#type").val(),
				typeName: $("#typeName").val(),
				labelText:$("#labelText").val(),
				optionText:$("#optionText").val(),
				value:$("#value").val(),
				innerOrder: $("#innerOrder").val(),
				enable:$("#enable").val()
			}
			configItem.updateDictionary(data);
		}
			
	});
	$("#query").click(function(){
		var typeName = $("#dictionaryType").val();
		configItem.getDictionaryList(1,typeName);
	});
	$("#del").click(function(){
		configItem.deleteDictionary();
	});
	$("#edit").click(function(){
		configItem.editDictionary();
	});
})