(function($) {
	window.flag=null;
	window.phonenumber=null;
	window.authentication = $.fn.authentication = {
		/*获取用户信息*/
		getUserList : function(goPageNum){
			$.ajax({
				url: "/user/getLoginInfo",
				type: "get",
				cache:false,
				dataType:'json',
				success : function(data){
					if(data.errorCode == "0"){
						var loginInfo = JSON.parse(data.dataBody.loginInfo);
						userInfo = loginInfo.user;
						$("#mobile").text(userInfo.mobile);
						$("#useName").text(userInfo.realName);
						$("#phone").text(userInfo.mobile);
						if(userInfo.isVerified == "1"){
							$("#identityFa").show();
							$("#identityBtn").hide();
						}else{
							$("#identityFa").hide();
							$("#identityBtn").show();
						}
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
		},
		sendCode:function(phonenumber){
			$.ajax({
				type : 'GET',
				url : "/sms/sendCode",
				data : {
					"mobile" : phonenumber
				},
				async:false,//
				cache:false,
				success : function(data) {
					if(data.errorCode==0){
						authentication.getCode();
						$.jBox.tip("短信发送成功");
					}else{
						$.jBox.tip(data.errorString);
					}
				}
			});
		},
		//校验短信验证码
		checkCode : function(mobile,code){
			var flag;
			$.ajax({
				type : 'GET',
				url : "/sms/checkCode",
				async: false,
				cache:false,
				data : {
					mobile : mobile,
					code: code
				},
				success : function(data) {
					if(data.errorCode==0){
						flag = true;
					}else{
						$.jBox.tip(data.errorString);
						return false;
					}
				}
			});
			return flag;
		},
		//发送短信验证码60秒倒计时
		getCode : function (){
		   var t = 60;
		   $("#sendCode").attr("disabled", true); 
		   $("#sendCode").text("重新发送(" + t + "s)"); 
		   var int = setInterval(function(){
			   $("#sendCode").text("重新发送(" + --t + "s)"); 
		        if(t==0){
		        	$("#sendCode").attr("disabled",false);
		            $("#sendCode").text("发送验证码"); 
		            clearInterval(int);
		        }
		   },1000)
		},
		//身份认证
		personalVerify:function(realName,mobileNum,idcardNo){
			$.jBox.tip("提交中", 'loading');
			$.ajax({
				url: "/unifiedInterfaceAccessPlatform/verifyNameAndMobileNumAndIdentity",
				type: "get",
				cache:false,
				data : {
					realName : realName,
					mobileNum: mobileNum,
					idcardNo: idcardNo
				},
				dataType:'json',
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.closeTip();
						$("#identity").modal("hide");
						authentication.getUserList(1);
					}else if(data.errorCode == "2010"){
						$.jBox.closeTip();
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
		},
		/*修改密码*/
		updatePassword : function(){
			if($("#oldPassword").val() == ""){
				$.jBox.tip("请输入旧密码","提示");	
				return false;
			}else if($("#password").val() == ""){
				$.jBox.tip("请输入新密码","提示");	
				return false;
			}else if(!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test($("#password").val()))){
				$.jBox.tip("请输入6~12位由数字和字母组合的密码","提示");	
				return false;
			}else if($("#newPassword").val() == ""){
				$.jBox.tip("请输入确认新密码","提示");	
				return false;
			}else if($("#password").val() != $("#newPassword").val()){
				$.jBox.tip("您两次设置的密码不一致","提示");	
				return false;
			}
			var oldPassword = $("#oldPassword").val(),
				newPassword = $("#newPassword").val();
			$.ajax({
				url: "/user/updatePassword",
				type: "post",
				data:{
					mobile: $("#mobile").text(),
					oldPassword: hex_sha1(oldPassword),
					newPassword: hex_sha1(newPassword)
				},
				cache:false,
				dataType:'json',
				success : function(data){
					if(data.errorCode == "0"){
						$.jBox.success("修改成功","提示");	
						$("#pass").modal('hide');
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
	}
	
})(jQuery);

$(document).ready(function($){
	authentication.getUserList();
	$("#sendCode").click(function(){
		var phonenumber = $("#phone").html();
		authentication.sendCode(phonenumber);
	});
	$("#authButton").click(function(){
		//身份证号，手机号，真实姓名认证
		var realName = $("#name").val();
		var idcardNo = $("#idcode").val();
		var phonenumber = $("#phone").html();
		var code = $("#code").val();
		if(realName == ""){
			$.jBox.tip("请输入真实姓名");
			return false;
		}else if(idcardNo == ""){
			$.jBox.tip("请输入身份证号");
			return false;
		}else if(code == ""){
			$.jBox.tip("请输入验证码");
			return false;
		}
		if(authentication.checkCode(phonenumber,code)){
			authentication.personalVerify(realName,phonenumber,idcardNo);
		}
	});
	
})