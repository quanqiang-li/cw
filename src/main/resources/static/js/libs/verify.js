/**
 * 与登录、注册和重置密码有关的所有脚本
 * @author lihongzhen
 */
var errorMessage1='请输入手机号码';
var errorMessage2='请输入正确的手机号码';
var errorMessage3='同意并遵守《爱信诺征信用户协议和隐私政...';
var errorMessage4='请输入手机验证码';
var errorMessage5='手机验证码输入错误';
var errorMessage6='请输入密码';
var errorMessage7='请输入6~12位由数字和字母组合的密码';
var errorMessage8='请输入确认密码';
var errorMessage9='请输入6~12位由数字和字母组合的确认密码';
var errorMessage10='您两次设置的密码不一致，请重新输入';
var errorMessage11='请输入真实姓名';
var errorMessage12='真实姓名不正确，请重新输入';
var errorMessage13='请输入企业名称';
var errorMessage14='请输入企业统一社会信用代码';


$(function() {
	/*for(var i=1;i<=3;i++){
		//点击验证码刷新
		$("#captcha_img_"+i).on("click",function(){
			var href = "/kaptcha/getKaptchaImage?codeKey="+Math.random();
			$(this).attr("src",href);
		});
	}*/
	//按下enter键实现登录 
    document.onkeydown=function mykeyDown(e){  
        //compatible IE and firefox because there is not event in firefox  
         e = e||event;  
         if(e.keyCode == 13) {
        	 $("#ssoLogin").click();  //调用登录按钮的登录事件  
         }   
    }
    //刷新置空
	for(var j=1;j<=3;j++){
		$('#errorMsg_p_'+j).html('');
		$('#errorMsg_div_'+j).hide();
	}
	//$(":text").val("");
	$(":password").val("");
	$(":checkbox").attr("checked",false);
	
	$("#send_2").on("click",function(){
		$.jBox.tip("请先拖拽滑块验证");
	})
	$("#send_3").on("click",function(){
		$.jBox.tip("请先拖拽滑块验证");
	})
	
	//滑块效果
	/*$("#slider3").slider({
        width: 300, // width
        height: 34, // height
        sliderBg: "rgb(134, 134, 131)", // 滑块背景颜色
        color: "#fff", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#33CC00", // 背景颜色
        time: 300, // 返回时间
        callback: function(result) { // 回调函数，true(成功),false(失败)
        	if(result){
        		$("#send_2").css("background","#0055ad");
        		$("#send_2").off("click");
        		$("#send_2").on("click",function(){
        			sendVerPhoneCode('register',this,2)
        		})
        	}else{
        		$("#send_2").on("click",function(){
        			$.jBox.tip("请先拖拽滑块验证");
        		})
        	}
        }
    });*/
	
	/*$("#slider4").slider({
        width: 300, // width
        height: 34, // height
        sliderBg: "rgb(134, 134, 131)", // 滑块背景颜色
        color: "#fff", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#33CC00", // 背景颜色
        time: 300, // 返回时间
        callback: function(result) { // 回调函数，true(成功),false(失败)
        	if(result){
        		if(result){
            		$("#send_3").css("background","#0055ad");
            		$("#send_3").off("click");
            		$("#send_3").on("click",function(){
            			sendVerPhoneCode('reSetPassWord',this,3);
            		})
            	}else{
            		
            	}
        	}
        }
    });*/
});

//获取url后的参数
function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); 
	return null;
}
//获取url后的参数数组
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//校验手机号方法
function checkPhone(n) {
	return checkPhoneGeneral(n,errorMessage1,errorMessage2);
}
function checkPhoneCode(n) {
	var code = $("#verCode_"+n).val();
	if(code == ""){
		$("#errorMsg_div_"+n).show();
		$("#errorMsg_p_"+n).html(errorMessage4);
		return false;
	}else{
		return true;
	}
	
}
function checkPhoneGeneral(n,err_msg_1,err_msg_2) {
	$("#errorMsg_div_"+n).hide();
	var phone = $.trim($('#phonenumber_'+n).val());
	if ((/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone))||(/^(5|6|8|9)\\d{7}$/.test(phone))) {
		return true;
	} else {
		$("#errorMsg_div_"+n).show();
		if(phone==""){
			$("#errorMsg_p_"+n).html(err_msg_1);
		}else{
			$("#errorMsg_p_"+n).html(err_msg_2);
		}
		return false;
	}
}
//校验登录密码，只校验空值
function passWord1() {
	$("#errorMsg_div_1").hide();
	var passWord = $('#password_1').val();
	if(passWord==''){
		$("#errorMsg_div_1").show();
		$("#errorMsg_p_1").html(errorMessage6);
		return false;
	}else{
		return true;
	}
}
//校验密码（注册、重置密码）的方法
function passWord(n){
	$("#errorMsg_div_"+n).hide();
	var passWord = $('#password_'+n).val();
	var rePassWord = $('#rePassword_'+n).val();
	if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(passWord))) {//正则表达式暂定
		return error(n,passWord,errorMessage6,errorMessage7);
	}else if(passWord != rePassWord && rePassWord != ""){
		return error(n,rePassWord,errorMessage9,errorMessage10);
	}else {
		return right(n);
	}
}
//校验再次输入密码方法
function rePassWord(n){
	$("#errorMsg_div_"+n).hide();
	var rePassWord = $("#password_"+n).val();
	var reReSetPassWd = $("#rePassword_"+n).val();
	if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(reReSetPassWd))) {//正则表达式暂定
		return error(n,reReSetPassWd,errorMessage8,errorMessage9);
	}else if(reReSetPassWd!=rePassWord){
		$("#errorMsg_div_"+n).show();
		$("#errorMsg_p_"+n).html(errorMessage10);
		return false;
	}else{
		return right(n);
	}
}
function checkboxGroup(n){
	var checkBox = $("#checkboxGroup_"+n).attr("checked");
	if(checkBox!="checked"){
		$("#errorMsg_div_"+n).show();
		$("#errorMsg_p_"+n).html(errorMessage3);
		return false;
	}else{
		return right(n);
	}
}
function error(n,value,msg1,msg2){
	$("#errorMsg_div_"+n).show();
	if(value==""){
		$("#errorMsg_p_"+n).html(msg1);
	}else{
		$("#errorMsg_p_"+n).html(msg2);
	}
	return false;
}

function right(n){
	$("#errorMsg_div_"+n).hide();
	return true;
}

//发送手机验证码
function sendVerPhoneCode(type,obj,n){
	if(type=='register' && checkPhone(2)){
		var phonenumber=$.trim($("#phonenumber_2").val());
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
					$.jBox.tip("短信发送成功");
					getCode(obj);
				}else{
					$.jBox.tip(data.errorString);
				}
			}
		});//End...$ajax
	}else if(type=='reSetPassWord' && checkPhone(3)){
		var phonenumber = $.trim($("#phonenumber_3").val());
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
					$.jBox.tip("短信发送成功");
					getCode(obj);
				}else{
					$.jBox.tip(data.errorString);
				}
			}
		});//End...$ajax
	}
		
			
}
//校验短信验证码
function checkCode(mobile,code){
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
}
//后台返回前台的处理方法
function messageAlert(n,data){
	var message = data.errorString;
	var errorCode=data.errorCode;
	if(errorCode==2001){
		return reCheck(n,message);
	}else if(errorCode==2002){
		return reCheck(n,message);
	}else if(errorCode==2003){
		return reCheck(n,message);
	}else if(errorCode==2004){
		return reCheck(n,message);
	}else if(errorCode==2005){
		return reCheck(n,message);
	}else if(errorCode==2006){
		return reCheck(n,message);
	}else if(errorCode==2007){
	    return reCheck(n,message);
	}else if(errorCode==3001){
		return reCheck(n,message);
	}else if(errorCode==3002){
		return reCheck(n,message);
	}else if(errorCode==3003){
		return reCheck(n,message);
	}else if(errorCode==3004){
		return reCheck(n,message);
	}else if(errorCode==3005){
		return reCheck(n,message);
	}else if(errorCode==3006){
		return reCheck(n,message);
	}else if(errorCode==4001){
		return reCheck(n,message);
	}else if(errorCode==4002){
		return reCheck(n,message);
	}else if(errorCode==4003){
		return reCheck(n,message);
	}else if(data.errorCode==0){
		return true;
	}
}
//提交后台失败后，前台显示提示信息，验证码刷新方法
function reCheck(n,message){
	$("#errorMsg_div_"+n).show();
	$("#errorMsg_p_"+n).html(message);
	//登录失败刷新验证码
	$("#captcha_img_"+n).click();
	//$.jBox.tip(data.errorString);
	return false;
}

function checkRealName(n){
    var realName = $("#realName").val();
    var reg = /^[\u4E00-\u9FA5A-Za-z\.·]{2,8}$/;
    if(!reg.test(realName)){
        $("#errorMsg_div_"+n).show();
        if(realName==""){
            $("#errorMsg_p_"+n).html(errorMessage11);
        }else{
            $("#errorMsg_p_"+n).html(errorMessage12);
        }
        return false;
    }
    return true;
}
function checkEntName(n){
    var entName = $("#entName").val();
    $("#errorMsg_div_"+n).show();
    if(entName==""){
        $("#errorMsg_p_"+n).html(errorMessage13);
        return false;
    }
    return true;
}
function checkNsrsbh(n){
    var nsrsbh = $("#shxydm").val();
    $("#errorMsg_div_"+n).show();
    if(nsrsbh==""){
        $("#errorMsg_p_"+n).html(errorMessage14);
        return false;
    }
    return true;
}

//获取验证码
function getKaptchaImage(i){
	var key = Math.random();
	$("#captcha_img_"+i).attr("src","/kaptcha/getKaptchaImage?codeKey="+key);
}  
//注册
function registered() {
	var phonenumber=$.trim($("#phonenumber_2").val());
	var password = $("#password_2").val();
	password= hex_sha1(password);
	var verPhoneCode = $("#verCode_2").val();
	var entName = $.trim($("#entName").val());
	var shxydm = $.trim($("#shxydm").val());
	var realName = $.trim($("#realName").val());
	if(checkEntName(2)&&checkNsrsbh(2)&&checkRealName(2)&&passWord(2)&&rePassWord(2)&&checkPhone(2)&&checkPhoneCode(2)&&checkboxGroup(2)){
		if (checkCode(phonenumber,verPhoneCode)){
			$.ajax({
				type : 'post',
				url : "/user/register",
				data : {
					"mobile" : phonenumber,
					"password" : password,
					"realName" : realName,
					"name" : entName,
					"unionCode" : shxydm,
					//"mobileCode" : verPhoneCode
				},
				cache:false,
				success : function(data) {
					if(data.errorCode == 0){
						$(".shade").hide();
						$("#tabmax").hide();
						$.jBox.tip("恭喜您注册成功！");
					}else{
						//滑块还原  重置登录按钮，阻止点击事件
						$(".refreshIcon").click();
						$("#send_2").css("background","#babab2");
						$("#send_2").off("click");
						$.jBox.tip(data.errorString);
					}
						
				}
			});//End...$ajax
		}else{
			$(".refreshIcon").click();
			$.jBox.tip("短信验证码不正确");
		}
	}
		
}
//重置密码
function reSetPassWord(){
	var phone = $.trim($("#phonenumber_3").val());
	var verPhoneCode3 = $("#verCode_3").val();
	var reSetPassWd = $("#password_3").val();
	reSetPassWd= hex_sha1(reSetPassWd);
	var imageCode = $("#code_3").val();
	if (checkPhone(3)&&passWord(3)&&rePassWord(3)&&checkPhoneCode(3)) {
		if(checkCode(phone,verPhoneCode3)){
			$.ajax({
				type : 'post',
				url : "/user/retrievePassword",
				data : {
					"mobile" : phone,
					"password" : reSetPassWd,
				},
				cache:false,
				success : function(data) {
					if(data.errorCode == 0){
						$(".shade").hide();	
						$("#tabmax_one").hide();
						$.jBox.tip("重置密码成功！");
						//重置密码成功
	//					window.location.href = "/sso/authorize?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri+"&state="+state;
					}else{
						$(".refreshIcon").click();
						$("#send_3").css("background","#babab2");
						$("#send_3").off("click");
						$.jBox.tip(data.errorString);
					}
				}
			});//End...$ajax
		}else{
			$(".refreshIcon").click();
			$.jBox.tip("短信验证码不正确");
		}
			
	}
}

//注册成功后3秒自动跳转到登录页签
/*function registSucToLogin(){
	var t=3;//设定跳转的时间 
    var set = setInterval(function(){
    	if(t==0){
    		ds2 = $('#modle').css('display');
    		if(ds2=="none"){
        		clearInterval(set);
        		return false;
        	}else{
        		setTab('one',1,2);
        		clearInterval(set);
        		return false;
        	}
        }
    	document.getElementById('successSpan').innerHTML=""+t+"秒后自动返回"; // 显示倒计时 
    	if(t==3){
			$("#modle").css("display","block");
    	}
    	ds1 = $('#modle').css('display');
    	console.log(ds1);
    	if(ds1=="none"){
    		clearInterval(set);
    		return false;
    	}
        t--; // 计数器递减 
    },1000); //启动1秒定时
}*/
//发送短信验证码60秒倒计时
function getCode(i){
	   var t = 60*3;
	   i.setAttribute("disabled", true); 
	   i.value="重新发送(" + t + "s)"; 
	   var int = setInterval(function(){
	        i.value="重新发送(" + --t + "s)"; 
	        if(t==0){
	             i.removeAttribute("disabled");
	             i.value="发送";   
	          clearInterval(int);
	        }
	   },1000)
	}
function foucs(){
	$('.search-img').animate({
		'top':'-23px'
	},2000);  
}
function blur1(){
	$('.search-img').animate({
		'top':'0'
	},2000);   
}