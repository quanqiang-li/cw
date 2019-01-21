/**
 * Created by aisono on 2017/7/21.
 */

initHeaders();
initFoot();
initNavsBar();
initMenu();
/**
 * 获取头部信息
 */
function initHeaders() {
    $.ajax({
        type: "GET",
        url: "/static/html/common/headers.html",
        async:false,
        dataType:"html",
        success: function(data){
            $("#head").html(data);
        }
    });
}
/**
 * 获取footer信息
 */
function initFoot() {
    $.ajax({
        type: "GET",
        url: "/static/html/common/footer.html",
        async:false,
        dataType:"html",
        success: function(data){
            $("#foot").html(data);
        }
    });
}

/**
 * 初始化导航
 */
function initNavsBar() {
    $.ajax({
        type: "GET",
        url: "/static/html/common/navsbar.html",
        async:false,
        dataType:"html",
        success: function(data){
            $("#navs").html(data);
            if(location.pathname.indexOf("index")!=-1){
            	$(".nav-right a").eq(0).addClass("active").siblings().removeClass("active");
            }else if(location.pathname.indexOf("product")!=-1 && location.pathname.indexOf("personalCenter") == -1){
            	$(".nav-right a").eq(1).addClass("active").siblings().removeClass("active");
            }else if(location.pathname.indexOf("personalCenter")!=-1){
            	$(".nav-right a").eq(2).addClass("active").siblings().removeClass("active");
            }            
        }
    });
}
/**
 * 初始化菜单
 */
function initMenu() {
    $.ajax({
        type: "GET",
        url: "/static/html/common/menu.html",
        async:false,
        dataType:"html",
        success: function(data){
            $("#menu").html(data); 
            if(window.localStorage.getItem("user")){
            	var user = window.localStorage.getItem("user"),
            		userType = JSON.parse(user).type;
                $("#menu li").removeClass("active");
				$("#menu ul li").each(function(){
					if($(this).attr("data-type") == userType || !$(this).attr("data-type")){
						$(this).show();
					}else{
						if(userType == "5" && $(this).text() =="申请管理"){
							$(this).show();
						}else{
							$(this).hide();
						}
					}
					if($("#titleTem").text() == $(this).text()){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("机构") != -1) && $(this).text() == "机构管理"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("机构用户") != -1) && $(this).text() == "机构用户"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("系统") != -1) && $(this).text() == "系统管理员"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("站点") != -1) && $(this).text() == "站点管理"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("站点用户") != -1) && $(this).text() == "站点用户"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("产品") != -1) && $(this).text() == "产品管理"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("申请") != -1) && $(this).text() == "申请管理"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("申请") != -1) && $(this).text() == "我的申请" && userType == "4"){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("待确认账款") != -1) && $(this).text() == "待确认账款" ){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}else if(($("#titleTem").text().indexOf("企业用户") != -1) && $(this).text() == "企业用户" ){
	            		$(this).addClass("active").siblings().removeClass("active");
	            	}
	        		
				})
            }
        }
    });
}