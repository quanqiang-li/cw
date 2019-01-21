(function($) {
	window.uuk = null,
	window.code = null,
	window.hxList = [],
	window.hxnameList = [],
	window.yxList = [],
	window.yxnameList = [],
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
							if(code == item.code){
								$option.attr("selected","selected");
							}
							$option.attr("value",item.id);
							$("#orgList").append($option);
						})
						if($("#orgList").val() != 0){
							institution.getBranchList($("#orgList").val());
						}
						$("#orgList").change(function(){
							var val = $(this).val(),
								text = $(this).find("option:selected").text();
							if(val != 0){
								hxList = [];
								yxList = [];
								institution.getBranchList(val);
								var sourceYx   = $("#yxlist-template").html();
								var templateYx = Handlebars.compile(sourceYx);
								$("#yxjg").html(templateYx(yxList));
							}
							if(uuk){
								institution.detBranchList();
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
						$.each(list,function(i,item){
							if($.inArray(item.branchOrgName, yxnameList) == -1){
								hxList.push({branchOrgId:item.branchOrgId, branchOrgName:item.branchOrgName});
							}
						})
						var source   = $("#hxlist-template").html();
						var template = Handlebars.compile(source);
						$("#hxjg").html(template(hxList));
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
		/*根据用户id解绑用户和其所有绑定金融机构*/
		detBranchList:function(id){
			$.ajax({
				url: "/financialOrgUser/untieAllRelationShipBetweenUserAndFinancialOrgByUserUuk",
				type: "post",
				data:{
					userUuk: uuk
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						yxList = [];
						yxnameList = [];
						var sourceYx   = $("#yxlist-template").html();
						var templateYx = Handlebars.compile(sourceYx);
						$("#yxjg").html(templateYx(yxList));
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
		/* 创建、修改用户机构 */
		createManager: function(id,type){
			if($("#mobile").val() == ""){
				$.jBox.tip ("请填写手机号码", "提示");
				return false;
			}
			if(uuk && type=="crt"){
				type = "upd";
			}
			$.ajax({
				url: "/financialOrgUser/createOrUpdateFinancialOrgUser",
				type: "post",
				data: {
					mobile: $("#mobile").val(),
					orgId: id,
					userUuk: uuk,
					operateType: type
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						if(data.dataBody.uuk){
							uuk = data.dataBody.uuk;
						}
						if(window.localStorage.getItem("financialOrgUserResultList")){
							var userData = JSON.parse(window.localStorage.getItem("financialOrgUserResultList")),
							branchOrgDesc = userData.branchOrgDesc,
							str = "";
						}
							
						if(type == "crt" || type == "upd"){
							$.each(hxList,function(i,item){
								if(item.branchOrgId == id){
									hxList.splice(i,1);
									yxList.push(item);
									if(userData){
										str = item.branchOrgId+":"+item.branchOrgName;
									}									
									return false;
								}
							})
							if(userData){
								userData.branchOrgDesc = userData.branchOrgDesc+","+str;
								window.localStorage.setItem("financialOrgUserResultList",JSON.stringify(userData));
							}
						}else{
							if(yxList.length == 1){
								$.jBox.confirm ("您是否确定解绑该机构，解绑后账号将会删除？", "提示",function(v, h, f){
									if (v === 'ok') {
										$.each(yxList,function(i,item){
											if(item.branchOrgId == id){
												yxList.splice(i,1);
												hxList.push(item);
												return false;
											}
										})
									}
									return true;
								});
							}else{
								$.each(yxList,function(i,item){
									if(item.branchOrgId == id){
										yxList.splice(i,1);
										hxList.push(item);
										if(userData){
											str = item.branchOrgId+":"+item.branchOrgName;
										}
										return false;
									}
								})
							}
							if(userData){
								userData.branchOrgDesc = branchOrgDesc.slice(str,str.length);
								window.localStorage.setItem("financialOrgUserResultList",JSON.stringify(userData));
							}
						}
						var source   = $("#hxlist-template").html();
						var template = Handlebars.compile(source);
						$("#hxjg").html(template(hxList));
						var sourceYx   = $("#yxlist-template").html();
						var templateYx = Handlebars.compile(sourceYx);
						$("#yxjg").html(templateYx(yxList));
						/*if(type == "type"){
							$.jBox.success("新增机构用户成功","提示");
						}else{
							$.jBox.success("用户解绑机构用户成功","提示");
						}*/
					}else if(data.errorCode == "2010"){
						$.jBox.error("登录信息已过期，请重新登录","提示");	
						setTimeout(function(){
							location.href = "/static/html/index.html";
							window.localStorage.clear();
						},1000)
					}else{
						$.jBox.error(data.errorString,"失败");
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
	if(util.request("userId")){
		$("#titleTem").text("编辑机构用户");
		var userData = JSON.parse(window.localStorage.getItem("financialOrgUserResultList"));
		branch = userData.branchOrgDesc.split(',');
		$.each(branch,function(i,item){
			var arr = item.split(':');
			yxList.push({branchOrgId:arr[0], branchOrgName:arr[1]});
			yxnameList.push(arr[1]);
		})
		uuk = userData.uuk;
		code = userData.code;
		$("#mobile").val(userData.mobile).attr("readonly","readonly");
		var sourceYx   = $("#yxlist-template").html();
		var templateYx = Handlebars.compile(sourceYx);
		$("#yxjg").html(templateYx(yxList));
	}else{
		window.localStorage.removeItem("financialOrgUserResultList")
	}
	institution.getOrgList();
})