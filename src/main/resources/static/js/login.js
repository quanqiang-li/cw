$(document).ready(function($){
	getTologin();
	toLoan()
	
    function getTologin(){
    	//判断是否登录
		if(window.localStorage.getItem("userInfo") && getCookie('eks_cache_keys')){
			$("#login").hide();
			$("#user").show();
			//getUsermeg();
			var userInfo = JSON.parse(window.localStorage.getItem("userInfo")),
				username = JSON.parse(window.localStorage.getItem("user")).name;
	
			$("#username").html("<a href ='javascript:;'><span id='nameUser'>"+username+"</span>，你好<i class='fa fa-caret-down mleft-10'></i></a>");
			getAllEnterprise(userInfo);
				
		}else{
			window.localStorage.clear();
			if(location.pathname.indexOf("personalCenter") != -1 || location.pathname.indexOf("apply") != -1){
				location.href = "/static/html/index.html";
			}
			jigsaw.init(document.getElementById('captcha'), function () {
				sliderLogin();
			})
			jigsaw.init(document.getElementById('captcha2'), function () {
				$("#send_2").css("background","#0055ad");
				$("#send_2").off("click");
				$("#send_2").on("click",function(){
					sendVerPhoneCode('register',this,2)
				})
			},function(){
				$("#send_2").css("background","#babab2");
				$("#send_2").off("click");
				$("#send_2").on("click",function(){
					$.jBox.tip("请先拖拽滑块验证");
				})
			})
			jigsaw.init(document.getElementById('captcha3'), function () {
				$("#send_3").css("background","#0055ad");
				$("#send_3").off("click");
				$("#send_3").on("click",function(){
					sendVerPhoneCode('reSetPassWord',this,3);
				})
			},function(){
				$("#send_3").css("background","#babab2");
				$("#send_3").off("click");
				$("#send_3").on("click",function(){
					$.jBox.tip("请先拖拽滑块验证");
				})
			})
		}
    }
	//滑块效果
	/*$("#slider2").slider({
        width: 200, // width
        height: 30, // height
        sliderBg: "rgb(134, 134, 131)", // 滑块背景颜色
        color: "#fff", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#33CC00", // 背景颜色
        time: 300, // 返回时间
        callback: function(result) { // 回调函数，true(成功),false(失败)
        	if(result){
        	}
        }
    });*/
		
	function sliderLogin(){
		$("#sign_in").css("background","#0055ad");
		//点击登录按钮
		$("#sign_in").on("click",function(){
			var user = $.trim($("#sign_user").val()),
				passWord = $("#sign_pass").val(),
				code = $.trim($("#sign_code").val()),
				url = $("#codeImg").attr("src"),
				key = url.slice(url.indexOf("=")+1,url.length),
				data = {};
			if(user == ""){
				$.jBox.tip("用户名不能为空，请填写！");
				return;
			}else if(passWord == ""){
				$.jBox.tip("密码不能为空，请填写！");
				return;
			}else if(user != "" && passWord != "" ){
				//$("#login-box").hide();
				data.mobile = user;
				data.password = hex_sha1(passWord);
				data.imageCode = code;
				data.codeKey = key;
				//checkCode(data);
				toLogin(data);
			}
		})
	}
	//滑过登录显示登录框	
	var block = false;
	$("#sigin").live("click",function(){
		$("#login-box").show();
		//getKaptchaImage($("#codeImg"));
		if(window.localStorage.getItem("userInfo")){
			getTologin();
		}
		block = true;
		if(block){
			entShow();
		}
	})
	
	//按下enter键实现登录 
	function entShow(){
		document.onkeydown=function mykeyDown(e){  
	        //compatible IE and firefox because there is not event in firefox  
	         e = e||event;  
	         if(e.keyCode == 13) {
	        	 $("#sign_in").click();  //调用登录按钮的登录事件  
	         }   
	    }
	}
	function entHide(){
		document.onkeydown=function mykeyDown(e){  
	        //compatible IE and firefox because there is not event in firefox  
	         e = e||event;  
	         if(e.keyCode == 13) {
	        	 return;  //调用登录按钮的登录事件  
	         }   
	    }
	}
	//验证码
	$("#codeImg").live("click",function(){
		getKaptchaImage($("#codeImg"))
	})
	$("#captcha_img_2").live("click",function(){
		getKaptchaImage($("#captcha_img_2"))
	})
	$("#captcha_img_3").live("click",function(){
		getKaptchaImage($("#captcha_img_3"))
	})
	
	$(document).live("click",function(e){ 
		if (!$(e.target).is('#login *') && !$(e.target).is('#sigin') && !$(e.target).is('.head-box *') && !$(e.target).is(".shade *")){
			$("#login-box").hide();
			block = false;
			if(!block){
				entHide()
			}
			//滑块还原  重置登录按钮，阻止点击事件
			$(".refreshIcon").click();
			$("#sign_in").css("background","#babab2");
			$("#sign_in").off("click");
		}
	});
	
	//校验验证码
	function checkCode(data){
		$.ajax({
			url: "/kaptcha/checkKaptcha",
			type: "get",
			cache:false,
			data:{
				clientCode: data.imageCode,
				codeKey: data.codeKey
			},
			dataType:"json",
			success : function(res){
				if(res.errorCode == "0"){
					
				}else{
					getKaptchaImage($("#codeImg"))
					$.jBox.tip(res.errorString);
				}
			}
		})
	}    
	//密码显示插件
    $('#password_1').hidePassword(true,{innerToggle: 'focus',toggle: {targetOffset: -23}});
	//点击注册
	$("#zcbtn").live("click",function(){
		block = false;
		  if(!block){
			  entHide()
		  }
		$("#login-box").hide();
		$(".shade").show();	
		$("#tabmax").show();
		getKaptchaImage($("#captcha_img_2"))
	})
	//忘记密码
	$("#wjbtn").live("click",function(){
		block = false;
		if(!block){
			  entHide()
		}
		$("#login-box").hide();
		$(".shade").show();	
		$("#tabmax_one").show();
		getKaptchaImage($("#captcha_img_3"))
	})
	$(".close").live("click",function(){
		$(".shade").hide();	
		$("#tabmax").hide();
		$("#tabmax_one").hide();
		//滑块还原  重置登录按钮，阻止点击事件
		$(".refreshIcon").click();
		$("#send_2").css("background","#babab2");
		$("#send_3").css("background","#babab2");
	})
	//获取验证码
	function getKaptchaImage(imgEle){
		var key = Math.random();
		imgEle.attr("src","/kaptcha/getKaptchaImage?codeKey="+key);
	}
	//登录
	function toLogin(data){
		$.ajax({
			url: "/user/login",
			type: "post",
			data: {
				mobile: data.mobile,
				password: data.password
			},
			dataType:"json",
			cache:false,
			success : function(data){
				//console.log(data);
				if(data.errorCode == "0"){
					var loginInfo = JSON.parse(data.dataBody.loginInfo),
						username,
						user = loginInfo.currentOrg;
					var orgInfoList = loginInfo.orgInfoList,
						tel = loginInfo.user.mobile;
					username = loginInfo.currentOrg.name;
					
					if(user.type == "1" && user.userOrgTitle == "1"){
						user.type = 1;
					}else if(user.type == "1" && user.userOrgTitle == "2"){
						user.type = 2;
					}else if(user.type == "1" && user.userOrgTitle == "3"){
						user.type = 5;
					}

					setCookie('eks_cache_keys',true);
					window.localStorage.setItem("tel",tel);
					window.localStorage.setItem("userInfo",JSON.stringify(orgInfoList));;
					window.localStorage.setItem("user",JSON.stringify(user));
					$("#login").hide();
					$(".user").show();
					$("#username").html("<a href ='javascript:;'><span id='nameUser'>"+username+"</span>，你好<i class='fa fa-caret-down mleft-10'></i></a>");
					toLoan();
					getAllEnterprise(orgInfoList);
				}else{
					$.jBox.tip(data.errorString);
					$(".refreshIcon").click();
					$("#sign_in").css("background","#babab2");
					$("#sign_in").off("click");
				}
			},
			error: function (data) {
				console.log(data);
				$("#login").show();
				$.jBox.tip ("登录有误...！", "提示");
            }
		})
	}
	//点击注销
	$("#logout").live("click",function(){
		console.log("注销")
		$.ajax({
			url: "/user/logout",
			type: "post",
			dataType:'json',
			contentType:"application/json; charset=UTF-8",
			cache:false,
			success : function(data){
				console.log(data)
				if(data.errorCode == 0){	
					$("#login").show();
					$(".user").hide();
					$(".enterprise").hide();
					$("#sign_user").val("");
					$("#sign_pass").val("");
					$("#sign_code").val("")
					$('#entname').html("");
					if(location.pathname.indexOf("personalCenter") != -1 || location.pathname.indexOf("apply") != -1){
						location.href = "/static/html/index.html";
					}else{
						window.location.reload();
					}
					window.localStorage.clear();
					
				}else{
					location.href = "/static/html/index.html";
					window.localStorage.clear();
					$.jBox.tip (data.errorString, "提示");
				}
			},
			error: function (data) {
				$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
            }
		})
	})

	//点击个人中心
	function toLoan(){
		$("#loan").live("click",function(event){
			 event.stopPropagation();
			 event.preventDefault();
			if(!window.localStorage.getItem("userInfo")){
				$("#loan").attr("href","javascript:;");
				$("#loan").removeClass("active");
				$.jBox.info("请登录！", "提示");
				if(location.pathname.indexOf("personalCenter") != -1){
					setTimeout(function(){location.href = "/static/html/index.html"},1000);
				}
			}else{
				location.href = "/static/html/personalCenter/center.html";
				$("#loan").addClass("active");
			}
		})
	}
	//获取用户信息
	function getUsermeg(){
		$.ajax({
			url: "/user/getLoginInfo",
			type: "get",
			cache:false,
			dataType:'json',
			success : function(data){
				if(data.errorCode == "0"){
					var loginInfo = JSON.parse(data.dataBody.loginInfo),
						username,
						user = loginInfo.currentOrg,
						orgInfoList = loginInfo.orgInfoList;
					
					username = loginInfo.currentOrg.name;
					if(user.type == "1" && user.userOrgTitle == "1"){
						user.type = 1;
					}else if(user.type == "1" && user.userOrgTitle == "2"){
						user.type = 2;
					}else if(user.type == "1" && user.userOrgTitle == "3"){
						user.type = 5;
					}

					$("#username").html("<a href ='javaScript:;'>"+username+"，你好<i class='fa fa-caret-down mleft-10'></i></a>");
					window.localStorage.setItem("userInfo",JSON.stringify(orgInfoList));
					window.localStorage.setItem("user",JSON.stringify(user));
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
		
	}

	//点击企业列表更换企业
	$('#username').live("click",function(){ 
		$(this).siblings('.ulDiv-ent').toggleClass('ulShow'); 
	});
	//企业信息
	function getAllEnterprise (orgInfoList){
		var str = "";
		$.each(orgInfoList,function(i,item){
			if($("#nameUser").text() == item.name){
				str += "<li data-id="+item.id+" class='active'>"+item.name+"</li>";
			}else{
				str += "<li data-id="+item.id+">"+item.name+"</li>";
			}
		})
		$("#entlist").html(str);
		$('.ulDiv-ent ul').on('click',"li",function(){  
			var selTxt=$(this).text(),
				selId = $(this).attr("data-id");
			if(location.pathname.indexOf("index") == -1 && selTxt != $("#nameUser").text()){
				$.jBox.confirm ("您即将切换身份，代表“<b>"+selTxt+"</b>”在本平台进行操作。如果您确定，将回到首页。", "提示",function(v, h, f){
					if (v == 'ok') {
						changeCurrentOrg(selId);
						$('.ulDiv-ent').toggleClass('ulShow');
					}else{
						$('.ulDiv-ent').toggleClass('ulShow');
						return true;
					}
				 });							
			}else if(location.pathname.indexOf("index") != -1){
				$('.ulDiv-ent').toggleClass('ulShow');
				changeCurrentOrg(selId);
			}else{
				$('.ulDiv-ent').toggleClass('ulShow');
			}
		});
	}
	//更换企业
	function changeCurrentOrg(id){
		$.ajax({
			url: "/user/changeCurrentOrg",
			type: "post",
			data:{
				id: id
			},
			cache:false,
			dataType:'json',
			success : function(data){
				if(data.errorCode == "0"){
					getUsermeg();
					setTimeout(function(){
						location.href = "/static/html/index.html";
					},500)
				}else if(data.errorCode == "2010"){
					$.jBox.error("登录信息已过期，请重新登录","提示");	
					setTimeout(function(){
						location.href = "/static/html/index.html";
						window.localStorage.clear();
					},1000)
				}else{
					$.jBox.tip (data.errorString, "提示");
				}
			},
			error: function (data) {
				$.jBox.tip ("服务器异常或请求超时，请稍后重试", "提示");
            }
			
		})
	}
	//判断有没有cookie我们就清localStorage缓存
	function getCookie(name) {    
		 var nameEQ = name + "=";   
		 var ca = document.cookie.split(';');    //把cookie分割成组    
		 for(var i=0;i < ca.length;i++) {    
			var c = ca[i];                      //取得字符串    
			while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格    
				 c = c.substring(1,c.length);      //有的话，从第二位开始取    
			}    
			 if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name    
				 console.log(unescape(c.substring(nameEQ.length,c.length))) 
				 return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值    
		 	}    
		 }   
		 return false;    
	}    
		    
	//清除cookie    
	function clearCookie(name) {    
		setCookie(name, "", -1);    
	}       
	//设置cookie    
	function setCookie(name, value, seconds) {    
		seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。    
		var expires = "";    
		if (seconds != 0 ) {      //设置cookie生存时间    
			var date = new Date();    
			date.setTime(date.getTime()+(seconds*1000));    
			expires = "; expires="+date.toGMTString();    
		}    
		document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值    
	} 
})
	