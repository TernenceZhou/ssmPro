<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
	<title></title>
	<link rel="Shortcut Icon" href="${pageContext.request.contextPath}/img/coop/logo2.png">
	<script src="${pageContext.request.contextPath}/assets/js/core/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
	<style>
		.main-content {
			position: absolute;
			right: 0vw;
			left: 0;
			height: 98vh;
		}
	</style>
</head>
<body>
<div>
	<div id="mainContent" class="main-content"></div>
</div>
<script>
	$(document).ready(() => {
		//获取url中的参数
		function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");// 匹配目标参数
			var result = window.location.search.substr(1).match(reg);// 对querystring匹配目标参数
			if (result != null) {
				return decodeURIComponent(result[2]);
			} else {
				return null;
			}
		}
		var $div = $('<img src="cpBase/Usual.getSacpCe.json?param1='+getQueryString('userId')+'" allowfullscreen="true" scrolling="no" width="100%" height="99%" style="border: none;"/>');
		$('#mainContent').append($div);
	});
</script>
</body>
</html>