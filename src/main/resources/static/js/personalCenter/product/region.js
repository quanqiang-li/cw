(function($) {
	/*放置放置已选省市的code*/	
	window.selectArray = [],
	/*放置已选城市的name、code */	
	window.selectList = [],
	window.region = $.fn.region = {
		/*获取所有省或直辖市的code */			
		getProvince:function(){
			$.ajax({
				url: "/region/getAllProvince",
				type: "get",
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var provinceList = JSON.parse(data.dataBody.provinceList);
						var source   = $("#province-template").html();
						var template = Handlebars.compile(source);
						$("#province").html(template(provinceList));
						$("#province").on("click","li",function(){
							if($(this).attr("data-id")){
								$(this).addClass("on").siblings().removeClass("on");
								region.getCity($(this).attr("data-id"),$(this).text());
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
		/*根据省的代码查下属的市区*/
		getCity:function(proCode,proName){
			$.ajax({
				url: "/region/getAllCityByProCode",
				type: "get",
				data: {
					proCode : proCode
				},
				dataType: "json",
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var cityList = JSON.parse(data.dataBody.cityList);
						var dataList = {
							cityList:cityList,
							proCode:proCode,
							proName:proName
						}
						var source   = $("#city-template").html();
						var template = Handlebars.compile(source);
						$("#city").html(template(dataList));
						//判断已选择区域是否有该省市下的地区值，添加选中样式
						if($.inArray(proCode, selectArray) !=-1){
							var selectYX = selectList[$.inArray(proCode, selectArray)].selectCity;
							$("#city dd").each(function(){
								var that = $(this);
								$.each(selectYX,function(i,item){
									if(that.attr("data-id") == item.code){
										that.addClass("on");
									}
								})
							})
							//判断是否为全选
							if(selectList[$.inArray(proCode, selectArray)].all){
								$(".all").addClass("on").text("取消全部");
							}
						}
							
						$("#city").off("click","dd");
						$("#city").on("click","dd",function(){
							//设置初始值
							var dataList = {
								selectCity:[],
								proCode:proCode,
								proName:proName,
								all:false
							}
							//判断是否有该省市下的地区值，没有则新添加
							if($.inArray(proCode, selectArray) ==-1){
								selectArray.push(proCode);
								selectList.push(dataList);
							}
							//获取该省市的数据
							var selectCity = selectList[$.inArray(proCode, selectArray)].selectCity;
							if($(this).attr("data-id") == proCode){
								//全部取消与全选
								if($(this).hasClass("on")){
									$(this).removeClass("on").text("全部");
									$("#city").find("dd").removeClass("on");
									//清空该省市的所有数据  全部取消
									selectList[$.inArray(proCode, selectArray)].all = false;
									selectList.splice($.inArray(proCode, selectArray),1);
									selectArray.splice($.inArray(proCode, selectArray),1);
								}else{
									//清空该省市的所有数据，重新添加全部地区的值
									selectCity.splice(0,selectCity.length);
									$.each(cityList,function(i,item){
										selectCity.push(item)
									})
									//标记是否全选
									selectList[$.inArray(proCode, selectArray)].all = true;
									$("#city").find("dd").addClass("on");
									$(this).addClass("on").text("取消全部");
								}
							}else{
								//单个取消与单选
								if($(this).hasClass("on")){
									var _this = $(this);
									$(this).removeClass("on");
									$(".all").text("全部");
									selectList[$.inArray(proCode, selectArray)].all = false;
									//查找这个城市的code，并删除这个对象
									$.each(selectCity,function(i,item){
										if(item.code == _this.attr("data-id")){
											selectCity.splice(i,1);
											return false;
										}
									})
								}else{
									$(this).addClass("on");
									selectCity.push({code:$(this).attr("data-id"), name:$(this).text()});
									if(selectCity.length == cityList.length){
										selectList[$.inArray(proCode, selectArray)].all = true;
										$(".all").addClass("on").text("取消全部");
									}
								}
							}
							region.getSelect(selectList);
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
		/*根据已选择的城市放入到已选择区域*/
		getSelect:function(selectList){
			var source   = $("#select-template").html();
			var template = Handlebars.compile(source);
			$("#select").html(template(selectList));
			//点击已选择区域的城市删除
			$("#select").off("click","dd");
			$("#select").on("click","dd",function(){
				$(this).removeClass("on");
				var proCode = $(this).attr("data-id").slice(0,2)+"0000",//获取该城市的省市code
					code = $(this).attr("data-id");
				//循环selectList 查找该城市数据并删除
				$.each(selectList,function(i,item){
					//查找该城市的省市code是否存在
					if(item.proCode == proCode){
						$.each(item.selectCity,function(v,val){
							if(val.code == code){
								item.all = false;
								item.selectCity.splice(v,1);
								return false;
							}
						})
					}
				})
				//显示城市的区域寻找相同项 置灰
				$("#city dd").each(function(){
					if($(this).attr("data-id") == code){
						$(this).removeClass("on");
						$(".all").removeClass("on").text("全部");
					}
				})
				region.getSelect(selectList);
			})
		},
		toNext:function(type){
			var regionStr = [];
			$.each(selectList,function(i,item){
				if(item.all && $.inArray(item.proCode,regionStr) == -1){
					//all=true,则为全选，且需将省市的code追加
					regionStr.push(item.proCode);
				}
				$.each(item.selectCity,function(v,val){
					if($.inArray(val.code,regionStr) == -1){
						regionStr.push(val.code);
					}
				})
			})
			if(regionStr.length==0){
				$.jBox.tip ("请选择城市", "提示");
				return false;
			}else{
				region.updateProduct($("#productAear").val(),regionStr.toString(),type);
			}
		},
		/*新建产品区域*/			
		updateProduct:function(openArea,region,type){
			$.ajax({
				url: "/product/updateProduct",
				type: "post",
				data:{
					id: util.request("id"),
					ProductRegionRelList: region
				},
				dataType: "json",
				cache:false,
				success : function(data){
					if(data.errorCode == "0"){
						if(type == "cel"){
							location.href = "productInfo.html?id="+util.request("id");
						}else{
							$.jBox.success("保存成功","提示");
							setTimeout(function(){
								location.href = "productDetail.html?id="+util.request("id");
							},1000)
						}
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
		//根据产品id获取开放地区
		getProductArea:function(){
			$.ajax({
				url: "/product/getProductArea",
				type: "get",
				dataType: "json",
				data:{
					id : util.request("id"),
				},
				cache:false,
				success : function(data){
					//console.log(data);
					if(data.errorCode == "0"){
						var productArea = data.dataBody.productArea;
						$.each(productArea,function(i,item){
							//item.areaCode = item.areaCode.toString();
							//判断item.areaCode是否等于该省市的code
							if(item.areaCode == item.areaCode.slice(0,2)+"0000" && $.inArray(item.areaCode.slice(0,2)+"0000", selectArray) ==-1){
								/* 
								 * 等于则判断selectArray是否有该省市code，
								 * 没有则直接将省市code、name放置selectList中，标记全选all=true
								 */
								selectArray.push(item.areaCode);
								selectList.push({
									selectCity:[],
									proCode:item.areaCode,
									proName:item.areaName,
									all:true
								})
							}else if($.inArray(item.areaCode.slice(0,2)+"0000", selectArray) ==-1){
								/*
								 * 不等于则判断selectArray中是否有拼接省市code
								 * 没有则将拼接省市code、name放置selectList中，并将自己放置selectCity中，标记全选all=false
								 */
								var areaName;
								//根据省市区域查找相同code，获取其名称
								$("#province li").each(function(){
									if(item.areaCode.slice(0,2)+"0000" == $(this).attr("data-id")){
										areaName = $(this).text();
									}
								})
								selectArray.push(item.areaCode.slice(0,2)+"0000");
								selectList.push({
									selectCity:[{code:item.areaCode,name:item.areaName}],
									proCode:item.areaCode.slice(0,2)+"0000",
									proName:areaName,
									all:false
								})
							}else if($.inArray(item.areaCode.slice(0,2)+"0000", selectArray) !=-1){
								/* 
								 * 不等于则判断selectArray中是否有拼接省市code
								 * 有则查找selectList中是否有该省市的code，
								 * 有则直接将不等于省市的市区的code、name放置
								 */
								var selectArea = selectList[$.inArray(item.areaCode.slice(0,2)+"0000", selectArray)].selectCity;
								if(item.areaCode != item.areaCode.slice(0,2)+"0000"){
									selectArea.push({code:item.areaCode, name:item.areaName})
								}else{
									//item.areaCode等于该省市的code，则为全选
									selectList[$.inArray(item.areaCode.slice(0,2)+"0000", selectArray)].all = true;
								}
								
							}
						})
						region.getSelect(selectList);
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
	region.getProvince(1);
	/*判断页面*/
	if(util.request("edit")){
		$(".next").hide();
		region.getProductArea();
	}
})