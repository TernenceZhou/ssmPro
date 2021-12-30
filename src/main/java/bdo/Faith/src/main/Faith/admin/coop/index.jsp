<%@ page import="java.util.regex.Pattern" %>
<%@ page import="cn.com.bdo.poi.common.Constants" %>
<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<!DOCTYPE html>
<!--[if IE 9]> <html class="ie9 no-focus" lang="zh-cn"> <![endif]-->
<!--[if gt IE 9]><!-->
<html class="no-focus" lang="zh-cn"> <!--<![endif]-->
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>
	<%--<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/oneui.css" id="css-main">--%>
	<link rel="Shortcut Icon" href="${pageContext.request.contextPath}/img/coop/logo2.png">
	<link rel="stylesheet" type="text/css" href="./admin/coop/css/normalize.css"/>
	<link rel="stylesheet" type="text/css" href="./admin/coop/css/login.css"/>
	<link rel="stylesheet" type="text/css" href="./admin/coop/css/component.css"/>
	<style>
		@font-face {
			font-family: 'FontAwesome';
			src: url('./assets/fonts/fontawesome-webfont.eot?v=4.7.0');
			src: url('./assets/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('./assets/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('./assets/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('./assets/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('./assets/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
			font-weight: normal;
			font-style: normal;
		}
		.fa {
			display: inline-block;
			font: normal normal normal 14px/1 FontAwesome;
			font-size: inherit;
			text-rendering: auto;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
		.fa-copyright:before {
			content: "\f1f9";
		}
		:after, :before {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
		:after, :before {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
		#errorMessage {
			text-align: center;
			width: 460px;
			border: none;
			color: red;
			line-height: 40px;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -230px;
			margin-top: 85px;
			background-color: floralwhite;
			opacity: 0.8;
			font-size: 13px;
		}
	</style>
	<script>

		/*var ua = navigator.userAgent;
		if(!(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))){
			window.location.href = "";
		}*/
	</script>
	<!--[if IE]>
	<script src="${pageContext.request.contextPath}/bdolx/js/html5.js"></script>
	<![endif]-->
	<script src="${pageContext.request.contextPath}/bdolx/js/browser.check.js"></script>
</head>
<%
	String ua = request.getHeader("User-Agent");
	ua=ua.toLowerCase();
	boolean isChrome = ua.contains("chrome") && ua.contains("webkit") && ua.contains("mozilla");
%>
<% if(isChrome) {%>
<body>
<div class="container demo-1">
	<div class="content">
		<div id="large-header" class="large-header">
			<canvas id="demo-canvas"></canvas>
			<div class="loggin-box-wrap">
				<div class="logo_box">
					<form action="#" name="bdoLoginAction" id="bdoLoginAction" method="post">
						<div class="input_outer">
							<span class="u_user"></span>
							<input name="ueserLoginId" class="text" style="" type="text" autocomplete="true"
								   placeholder="请输入账号（不含@bdo.com.cn）">
						</div>
						<div class="input_outer">
							<span class="us_uer"></span>
							<input name="pwd" class="text"
								   style="position:absolute; z-index:100;" value=""
								   autocomplete="true"
								   type="password" placeholder="请输入密码">
						</div>
						<div class="mb2"><a id="loginBtn" class="act-but submit" href="javascript:"
											style="color: #FFFFFF">登录</a></div>
					</form>
				</div>
			</div>
			<div id="errorMessage" style="position:absolute;"></div>
		</div>
	</div>
</div><!-- /container -->
<div id="" style="align-content: center;text-align: center;position: fixed;bottom: 1rem;left: 0px;right: 0px;z-index: 10000;"><i class="fa fa-copyright">2020 立信会计师事务所(特殊普通合伙) All rights reserved. 沪ICP备12039590号-1</i></div>
<script src="./admin/coop/js/TweenLite.min.js"></script>
<script src="./admin/coop/js/EasePack.min.js"></script>
<script src="./assets/js/core/jquery.min.js"></script>
<script src="./assets/js/core/jquery.storage.js"></script>
<script src="./admin/coop/js/login.js"></script>
<script>
	$(document).ready(function() {
		$.sessionStorage('loginData', null);
		//var loginUrl = './bdologin.do?m=login';
		var loginUrl = '<%=request.getAttribute("loginUrl")%>';
		if (loginUrl == '' || loginUrl == null || loginUrl == 'null') {
			loginUrl = './bdologin.do?m=login';
		}


		// 按Enter键提交 13：Enter
		$(':input[name="ueserLoginId"],:input[name="pwd"]').keyup(function(e) {
			if (e.keyCode == 13) {
				$('#bdoLoginAction').attr('action', loginUrl);
				$('#bdoLoginAction').submit();
			}
		});
		// 按"登录"键提交
		$('#loginBtn').click(function(e) {
			$('#bdoLoginAction').attr('action', loginUrl);
			$('#bdoLoginAction').submit();
		});

		$('#errorMessage').css({
			'background-color': 'transparent',
			'opacity': '1'
		}).html("");
		var errorMessage = '<%=request.getAttribute("errorMessage")%>';
		if (errorMessage != null && errorMessage.length > 0) {
			$('#errorMessage').css({
				'background-color': 'floralwhite',
				'opacity': '0.8'
			}).html(errorMessage);
		}
	});
</script>
<script src="${pageContext.request.contextPath}/bdolx/js/browser.check.js"></script>
</body>
<%} else {%>
<body>
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/bootstrap.min.css">
<link rel="stylesheet" id="css-main" href="${pageContext.request.contextPath}/assets/css/oneui.css">
<div class="content bg-white text-center pulldown overflow-hidden">
	<div class="row">
		<div class="col-sm-6 col-sm-offset-3">
			<h3 class="font-s128 font-w300 text-danger animated bounceInDown">请使用Chrome 浏览器!</h3>
		</div>
	</div>
</div>
</body>
<%}%>
</html>