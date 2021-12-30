<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<style type="text/css">
.loginLabel {font-size:12px;line-height:15px;color:white !important;}
.loginImg {
    background-image: url(./img/bdo/login.png);
    width: 70px !important;
	height: 25px !important;
}
</style>
<title>审计业务综合管理平台</title>
<script type="text/javascript" src="${pageContext.request.contextPath}/admin/login/login.js"></script>
<script type="text/javascript">
	var helpURL = "./admin/desktop/aboutus.jsp";
	var ueserLoginId = '<%=request.getAttribute("ueserLoginId")%>';
	var rememberPwd = '<%=request.getAttribute("rememberPwd")%>' == 'on' ?true:false;
	var errorMessage = '<%=request.getAttribute("errorMessage")%>';
	var ldap = '<%=request.getAttribute("ldap")%>';
	var lo = '<%=request.getAttribute("loginUrl")%>';
	var loginUserTip = "请输入账号";
	if(ldap == '1'){
		loginUserTip = 'BDO邮箱用户名';
	}else if (ldap == '0'){
		loginUserTip = '原项目管理系统用户名';
	}
	if(Ext.isEmpty(errorMessage )){
		if(ldap == '1'){
			errorMessage = '请输入BDO邮箱用户名及密码(用户名不包含@bdo.com.cn)。';
		}else if (ldap == '0'){
			errorMessage = '请输入原项目管理系统用户名及密码。';
		}
	}
	Ext.onReady(function(){init()});
</script>
</head>
<body>
<div id="loginDiv" align="center" style="position: absolute; top: 20%; width: 100%; height:80%"></div>
</body>
</html>