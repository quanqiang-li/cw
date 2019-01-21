(function($) {
	window.templateView = $.fn.templateView = {
			getContract:function(tempId,applyId){
				$.ajax({
					url: "/applyContract/getApplyContractList",
					type: "get",
					data: {
						applyId: applyId,
						tempId: tempId
					},
					dataType: "json",
					cache:false,
					success : function(data){
						if(data.errorCode == "0"){
							var content = data.dataBody.listContract[0].content;
							$("#templateContent").html(content);
						}
					},
					error: function (data) {
						$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
		            }
				})
			},
			previewApplyContract:function(tempId,applyId){
				$.ajax({
					url: "/applyContract/previewApplyContract",
					type: "get",
					data: {
						applyId: applyId,
						tempId: tempId
					},
					dataType: "json",
					cache:false,
					success : function(data){
						if(data.errorCode == "0"){
							var content = data.dataBody.contractTemplate.content;
							$("#templateContent").html(content);
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
	var templateId = util.request("templateId");
	var applyId = util.request("applyId");
	if(util.request("type")){
		templateView.previewApplyContract(templateId,applyId);
	}else{
		templateView.getContract(templateId,applyId);
	}
	
	
}) 