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
	<title id="systemName">立信智能审计云平台</title>
	<link rel="Shortcut Icon" type="image/x-icon" href="/img/coop/logo2.png" />
	<link rel="shortcut"      type="image/x-icon" href="/img/coop/logo2.png" />
	<link rel="SHORTCUT ICON" type="image/x-icon" href="/img/coop/logo2.png" />

	<link rel="stylesheet" href="/assets/css/bootstrap.min.css">
	<link rel="stylesheet" id="css-main" href="/assets/css/oneui.css">
	<link rel="stylesheet" type="text/css" href="/admin/sacp/css/normalize.css"/>
	<link rel="stylesheet" type="text/css" href="/admin/sacp/css/login.css"/>
	<link rel="stylesheet" type="text/css" href="/admin/sacp/css/component.css"/>

	<!--[if IE]>
	<script src="/bdolx/js/html5.js"></script>
	<![endif]-->
	<script src="/bdolx/js/browser.check.js"></script>
</head>
<body>
<div class="demo-1">
	<div class="">
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
						<input type="hidden" name="fromDomain" value="" />
						<input type="hidden" name="systemId" value="" />
						<input type="hidden" name="method" value="" />
						<input type="hidden" name="loginUrl" value="" />
						<input type="hidden" name="loginType" value="" />
						<input type="hidden" name="chrome" value="" />
					</form>
				</div>
			</div>
			<div id="errorMessage"></div>
		</div>
	</div>
</div>
<div id="login-page-foot">
	<i class="fa fa-copyright">2020 立信会计师事务所(特殊普通合伙) All rights reserved. 沪ICP备12039590号-1</i>
</div>
<script src="/admin/coop/js/TweenLite.min.js"></script>
<script src="/admin/coop/js/EasePack.min.js"></script>
<script src="/assets/js/core/jquery.min.js"></script>
<script src="/assets/js/core/jquery.storage.js"></script>
<script src="/admin/sacp/js/login.js"></script>
<script src="/bdolx/js/browser.check.js"></script>
</body>
</html>