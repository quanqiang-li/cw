$(document).ready(function($){
	/*
	 * 公用css
	*/
	/*$("head").append('<link href="/images/a16X16.ico" type="image/x-icon" rel="shortcut icon">')*/
	$("head").append('<link rel="stylesheet" href="/static/js/libs/bootstrap/buttons.css" />')
	$("head").append("<link href='/static/js/libs/jBox/css/jbox.css' rel='stylesheet' type='text/css'/>")
	$("head").append("<link href='/static/js/libs/font-awesome/css/font-awesome.css' rel='stylesheet' type='text/css'/>")
	$("head").append("<link href='/static/js/libs/hideShowPassword/css/example.wink.css' rel='stylesheet' type='text/css'/>")
	$("head").append("<link href='/static/js/libs/validation/css/validate.css' rel='stylesheet' type='text/css'/>")
	$("head").append("<link href='/static/js/libs/jigsaw/jigsaw.css' rel='stylesheet' type='text/css'/>")
	/*
	 * 公用js 
	*/
	//公用组件
	$(document).append("<script src='/static/js/inits.js'></script>")
	//bootstrap
	$(document).append("<script src='/static/js/libs/bootstrap/bootstrap.min.js'></script>")
	$(document).append("<script src='/static/js/libs/bootpag/bootstrap-paginator.min.js'></script>")
	//handlebars
	$(document).append("<script src='/static/js/libs/handlebars/handlebars-v3.0.3.js'></script>")
	//密码加密
	$(document).append("<script src='/static/js/libs/hideShowPassword/hideShowPassword.js'></script>")
	$(document).append("<script src='/static/js/libs/sha1.js'></script>")
	//jBox
	$(document).append("<script src='/static/js/libs/jBox/js/jquery.jBox-2.3.min.js'></script>")
	$(document).append("<script src='/static/js/libs/jBox/js/jquery.jBox-zh-CN.js'></script>")
	$(document).append("<script src='/static/js/libs/jBox/js/browser.js'></script>")
	$(document).append("<script src='/static/js/libs/jBox/js/jquery.jBox-zh-CN.js'></script>")
	//表单验证插件
	$(document).append("<script src='/static/js/libs/validation/jquery.validate.js'></script>")
	$(document).append("<script src='/static/js/libs/validation/localization/messages_zh.min.js'></script>")
	$(document).append("<script src='/static/js/libs/validation/jquery.validate.js'></script>")
	$(document).append('<script type="text/javascript" src="/static/js/libs/luhn.js"></script>')
	$(document).append('<script type="text/javascript" src="/static/js/libs/checkCard.js"></script>')
	//拖拽图片
	$(document).append("<script src='/static/js/libs/jigsaw/jigsaw.js'></script>")
	$(document).append("<script src='/static/js/libs/jquery.slider.min.js'></script>")
	
	$(document).append("<script src='/static/js/libs/verify.js'></script>")
	$(document).append("<script src='/static/js/login.js'></script>")
	
})
