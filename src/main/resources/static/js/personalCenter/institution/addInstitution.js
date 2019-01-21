(function($) {
	window.institution = $.fn.institution = {
		/*新建机构*/
		createOrg:function(dataList){
			$.ajax({
				url: "/financialOrg/createFinancialOrg",
				type: "post",
				data: dataList,
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						location.href="institution.html";
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
		},
		/*点击文件*/
		change:function(){
			var formData = new FormData($("#financialorg")[0]);
            formData.append("uploadFileType","F001");
			$.jBox.tip("上传中...！", "loading");
            $.ajax({
                url :'/file/standardFileUpload',
                type : 'POST',
                data : formData,
                async : false,
                cache : false,
                dataType : "json",
                contentType : false,
                processData : false,
                success : function(data) {
                    if (data.errorCode == "0") {
                        $.jBox.tip("上传成功");
                        $("#logo").val(data.dataBody.fileDownloadWebPath)
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
                },
				error:function(){
					$.jBox.tip("服务器异常，请稍后重试。");
				}
            });
		},
		//点击下一步验证表单
		validateForm : function(){
			$("#financialorg").validate({
				debug: true,
				rules: {
					insName: "required",
					code: "required",
					unionCode: "required",
					netAddr: "required",
					logo: "required",
				},
			    messages: {
			    	insName: "请输入机构名称",
			    	code: "请输入机构代码",
					unionCode: "请输入统一社会信用代码",
			    	netAddr: "请输入机构地址",
			    	logo: "请选择机构logo",
			    }
			});			
		},
	}
	
})(jQuery);

$(document).ready(function($){
	institution.validateForm();
	$("#cancel").click(function(){
		location.href="institution.html";
	})
	$("#sure").click(function(){
		if($("#financialorg").valid() == true){
			var data = {
				name: $("#insName").val(),
				code: $("#code").val(),
				unionCode: $("#unionCode").val(),
				netAddr: $("#netAddr").val(),
				logo: $("#logo").val() 
			}
			institution.createOrg(data);
		}
			
	})
})