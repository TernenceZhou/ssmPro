<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<!DOCTYPE html>
<!--[if IE 9]>         <html class="ie9 no-focus" lang="zh-cn"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-focus" lang="zh-cn"> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<title>审计业务综合管理平台</title>
<link rel="stylesheet" type="text/css" href="./admin/outuser/css/normalize.css" />
<link rel="stylesheet" type="text/css" href="./admin/outuser/css/login.css" />
<link rel="stylesheet" type="text/css" href="./admin/outuser/css/component.css" />
<style>
	 #errorMessage{
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
<!--[if IE]>
<script src="js/html5.js"></script>
<![endif]-->
</head>
<body>
		<div class="container demo-1">
			<div class="content">
				<div id="large-header" class="large-header">
					<canvas id="demo-canvas"></canvas>
					<div class="logo_box">
						<h3>欢迎您</h3>
						<form action="#" name="bdoLoginOutUserAction" id="bdoLoginOutUserAction" method="post">
							<div class="input_outer">
								<span class="u_user"></span>
								<input name="ueserLoginId" class="text" style="color: #FFFFFF !important" type="text" placeholder="请输入账号（不含@bdo.com.cn）">
							</div>
							<div class="input_outer">
								<span class="us_uer"></span>
								<input name="pwd" class="text" style="color: #FFFFFF !important; position:absolute; z-index:100;"value="" type="password" placeholder="请输入密码">
							</div>
							<div class="mb2"><a id="loginBtn" class="act-but submit" href="javascript:" style="color: #FFFFFF" >登录</a></div>
						</form>
					</div>
				<div id="errorMessage"></div>
					
				</div>
			</div>
		</div><!-- /container -->
		<script src="./admin/outuser/js/TweenLite.min.js"></script>
		<script src="./admin/outuser/js/EasePack.min.js"></script>
		<script src="./admin/outuser/js/login.js"></script>
		<script src="./assets/js/core/jquery.min.js"></script>
		<script src="./assets/js/core/jquery.storage.js"></script>
		<script>
			$(document).ready(function(){
				
				//var loginUrl = './bdologin.do?m=login';
				var loginUrl = '<%=request.getAttribute("loginUrl")%>';
				if (loginUrl == '' || loginUrl == null || loginUrl == 'null'){
					loginUrl = './bdooutuserlogin.do?m=login';
				}
								
			
				// 按Enter键提交 13：Enter
				$(':input[name="ueserLoginId"],:input[name="pwd"]').keyup(function(e){
					if(e.keyCode == 13){ 
						$('#bdoLoginOutUserAction').attr('action',loginUrl);
						$('#bdoLoginOutUserAction').submit();
					}
				});
				// 按"登录"键提交
				$('#loginBtn').click(function(e){
					$('#bdoLoginOutUserAction').attr('action',loginUrl);
					$('#bdoLoginOutUserAction').submit();
				});
				
				$('#errorMessage').css({
					'background-color': 'transparent',
    				'opacity' : '1'
				}).html("");
				var errorMessage = '<%=request.getAttribute("errorMessage")%>';
				if(errorMessage != null && errorMessage.length > 0){
					$('#errorMessage').css({
						'background-color': 'floralwhite',
	    				'opacity' : '0.8'
					}).html(errorMessage);
				}
			});
		</script>
	</body>
</html>