<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<%@ page import="cn.com.bdo.base.listener.UserSession"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="-1" />
	<meta http-equiv="Cache" content="no-cache">
	<meta name="spreadjs culture" content="zh-cn"/>
	<title></title>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp"%>
	<%@ include file="/cpShare/partnerModal.jsp"%>

	<%@ include file="/dgCenter/common/spreadJS14.0.6.css.jsp"%>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/dgCenter/css/dg/designer.css">

	<!-- Page JS Code -->
	<%--<script src="${pageContext.request.contextPath}/bdolx/main/main.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/menu.js"></script>--%>
	<script src="${pageContext.request.contextPath}/bdolx/main/side.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>

	<%--<script>
		var sys_userId = '<%=userSession.getUserId()%>';
		var trinfo = '<%=request.getAttribute("trinfo")%>';
		var userCustomers = '<%=userSession.getUserCustomers()%>';
		var BDO_CUSTOMER_SELECT = '<%=userSession.getCurCustomerId()%>';
		var BDO_CUSTOMERNAME_SELECT = '<%=userSession.getCurCustomerName()%>';
		var BDO_YEAR_SELECT = (new Date()).getFullYear() - 1;
		var BDO_PROJECT_SELECT = '<%=userSession.getCurProjectId()%>';
		var BDO_PROJECTNAME_SELECT = '<%=userSession.getCurProjectName()%>';
		var bid = '<%=request.getAttribute("bid")%>';
		var spreadDesignerPath = encodeURI('${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/');
		if (sys_userId == '') {
			sys_userId = window.CUR_USERID;
		}
	</script>--%>
	<style>
		.main-content {
			position: absolute;
			right: 0;
			left: 0;
			height: 100vh;
		}
		.gc-sjsdesigner-dialog.gc-designer-root.cn .container{
			width: 100%;
		}
	</style>
</head>
<body >

<div id="mainContent" class="main-content"></div>

<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp"%>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/designer.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/js/baseNotePage.js"></script>

<script>
	$(document).ready(() => {
		if(window.nodeData == null) {
			window.nodeData = JSON.parse($.sessionStorage('baseNoteNode'));
		}
		searchSubjecttreeNode(JSON.parse($.sessionStorage('baseNoteNode')), function(node){
			if(node.extraOptions.autoId == nodeData.autoId) {
				nodeData = node;
				nodeData.autoId = nodeData.extraOptions.autoId;
				nodeData.currentNode = $.extend(false, {}, node);
				nodeData.currentNode.currentNode = null;
			}
		});
		if (nodeData) {
			BaseNotePage({region: '#mainContent', data: nodeData});
		}
	});

</script>
</body>
</html>