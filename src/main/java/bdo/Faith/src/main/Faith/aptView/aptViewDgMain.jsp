<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

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
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<%@ include file="/cpShare/partnerModal.jsp" %>

	<%@ include file="/dgCenter/common/spreadJS14.0.6.css.jsp" %>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/dgCenter/css/dg/designer.css">

	<!-- Page JS Code -->
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
	<style type="text/css">
		.gc-sjsdesigner-dialog.gc-designer-root.cn .container{
			width: 100%;
		}
	</style>
</head>
<body>
<div>
	<div id="mainContent1" style="height: 100vh"></div>
	<div id="sideRegin"></div>
</div>

<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp" %>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<%-- <script src="${pageContext.request.contextPath}/dgCenter/common/DG_CONST_STATE.js"></script> --%>

<script src="${pageContext.request.contextPath}/dgCenter/js/dg/postil.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/postils.js"></script>
<%-- <script src="${pageContext.request.contextPath}/dgCenter/js/dg/adjustTab.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/subject.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/functions.js"></script> --%>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/designer.js"></script>
<%-- <script src="${pageContext.request.contextPath}/dgCenter/js/dg/spreadEdit.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingResult.js"></script> --%>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/spreadEdit_functions.js"></script>
<script src="${pageContext.request.contextPath}/aptView/js/aptView.js"></script>
<script>
	$(document).ready(() => {
		var nodeData = JSON.parse($.sessionStorage('subjecttreeNode'));
		if (nodeData) {
			window.sys_menuId = nodeData.menuId;
			AptViewPage({region: '#mainContent1', data: nodeData});
		}
	});
</script>
</body>
</html>