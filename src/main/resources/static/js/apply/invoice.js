(function($) {
	window.invoiceList = null;
	window.applyNo = null;
	window.invoice = $.fn.invoice = {
		/*获取发票*/
		getList:function(datalist){
			var arr = datalist.contractGoods.split(";");
			var reimburseCom = datalist.reimburseCom;
			//var contractId = datalist.contractNo;
			var purchaseCom = datalist.purchaseCom;
			var beginDate = datalist.startDate;
			var endDate = datalist.endDate;
			$.ajax({
				url: "/invoiceSelect/invoiceQuery",
				type: "post",
				traditional:true,
				data: {
					productNames:arr,
					//contractId:contractId,
					reimburseCom:reimburseCom,
					purchaseCom:purchaseCom,
					beginDate:beginDate,
					endDate:endDate
				},
				traditional:true,
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						var invoices = data.dataBody.invoices;
						var source   = $("#rz-template").html();
						var template = Handlebars.compile(source);
						$("#rz-table").html(template(invoices));
						invoiceList = invoices;
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
	    search:function(){
			var contractNo = $("#contractNo").val(),
				purchaseCom = $("#purchaseCom").val(),
				reimburseCom = $("#reimburseCom").val(),
				startDate = $("#startDate").val()
				endDate = $("#endDate").val(),
				contractGoods = $("#contractGoods").val(),
				data = {};
	    	if(contractNo != ""){
	    		data.contractNo = contractNo;
	    	}
	    	if(purchaseCom != ""){
	    		data.purchaseCom = purchaseCom;
	    	}
	    	if(reimburseCom != ""){
	    		data.reimburseCom = reimburseCom;
	    	}
	    	if(startDate != ""){
	    		data.startDate = startDate;
	    	}
	    	if(endDate != ""){
	    		data.endDate = endDate;
	    	}
	    	if(contractGoods != ""){
	    		data.contractGoods = contractGoods;
	    	}
	    	invoice.getList(data);
	    },
	    //选入发票
	    select:function(){
	    	var arr = new Array();
			$("input[type=checkbox]:checked").each(function(i){
				arr[i] = $(this).val();
			});
			if(arr.length == 0){
				$.jBox.tip("请选择发票");
				return;
			}
			var selectedInvoice = new Array();
			$.each(arr,function(index,value){
				$.each(invoiceList,function(i,item){
					if(arr[index] == item.invoiceNum){
						selectedInvoice.push(item);
					}
				});
			});
			var invoiceJson = JSON.stringify(selectedInvoice);
			$.ajax({
				url: "/invoiceSelect/invoiceInsert",
				type: "post",
				contentType:"application/json",
				data: "{\"invoices\":"+invoiceJson+",\"applyNo\":\""+applyNo+"\"}",
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.tip("保存成功","提示");
						window.localStorage.setItem("selectedInvoice",invoiceJson);
						window.localStorage.removeItem("invoice");
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
	}
	
})(jQuery);

$(document).ready(function($){
	//获取应收账款发票相关信息，默认开始日期为开票日期，结束日期为开票日期+1个月
	if(window.localStorage.getItem("invoice")){
		var data = JSON.parse(window.localStorage.getItem("invoice"));
		$("#purchaseCom").val(data.purchaseCom);
		$("#contractNo").val(data.contractNo);
		$("#reimburseCom").val(data.reimburseCom);
		$("#contractGoods").val(data.contractGoods);
		$("#startDate").val(data.contractInvoiceDate);
		var date = new Date(data.contractInvoiceDate.replace(/-/g,"/"));
		date.setMonth(date.getMonth()+1);
		var endDate = util.formatDate(date,'yyyy-MM-dd');
		$("#endDate").val(endDate);
		data.startDate = $("#startDate").val();
		data.endDate = $("#endDate").val();
		invoice.getList(data);
	}
	applyNo = util.request("applyNo");
})