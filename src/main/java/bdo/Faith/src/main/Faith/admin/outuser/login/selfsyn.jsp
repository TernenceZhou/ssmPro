<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户同步域账号</title>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/admin/login/selfsyn.js"></script>
 <script type="text/javascript"> 
    function exitSystem() { 
		window.location="${pageContext.request.contextPath}/bdologin.do?m=exitSystem";
	}
	function onClose(){
		 if(  window.event.clientY < 0 || (window.event.altKey )) {
		 	exitSystem();
		 }
	}
    	
	    var userName = '<%=request.getAttribute("userName")%>';
	    var userAuditDepartName = '<%=request.getAttribute("userAuditDepartName")%>';
	    var userAuditDepartmentName = '<%=request.getAttribute("userAuditDepartmentName")%>';
	    var userInfo = '<%=request.getAttribute("userInfo")%>';
	    var trinfo = '<%=request.getAttribute("trinfo")%>';
	    var lastVersion = '<%=request.getAttribute("laster_version")%>';
	    var deskImg = '<%=request.getAttribute("deskImg")%>';
	    var deskSt = '<%=request.getAttribute("deskImgSt")%>';
	    var canSelfSyn = '<%=request.getAttribute("canSelfSyn")%>';
	Ext.onReady(function(){init()});
</script>

</head>
<body onbeforeunload='onClose();' >
<div id="mainDiv" align="center"
	style="position: absolute; top: 20%; width: 100%; height:80%" ></div>
<div align="center" style="position: absolute; top: 10%; width: 100%; "></div>
</body>
</html>