<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

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
		.sidebar-l #side-overlay-likai {
			right: 0;
			-webkit-transform: translateX(100%) translateY(0) translateZ(0);
			-ms-transform: translateX(100%) translateY(0);
			transform: translateX(100%) translateY(0) translateZ(0);
		}

		.side-scroll #side-overlay-likai {
			overflow-y: hidden;
		}

		#side-overlay-likai {
			width: 320px;
			-webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
		}

		#side-overlay-likai {
			background-color: #fff;
		}

		#side-overlay-likai {
			position: fixed;
			top: 40px;
			bottom: 0;
			z-index: 1032;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			-webkit-transition: all 0.28s ease-out;
			transition: all 0.28s ease-out;
		}

		.side-overlay-hover #side-overlay-likai:hover, .side-overlay-o #side-overlay-likai, .side-overlay-o.side-overlay-hover #side-overlay-likai {
			-webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
			-webkit-transform: translateX(0) translateY(0) translateZ(0);
			-ms-transform: translateX(0) translateY(0);
			transform: translateX(0) translateY(0) translateZ(0);
		}

		.gc-sjsdesigner-dialog.gc-designer-root.cn .container{
			width: 100%;
		}
	</style>
</head>
<body>

<%--<div id="mainContent2" class="main-content"></div>--%>
<%--<div class="aside-right">--%>
<div id="dgFile" class="main-content">
	<div>
		<ul class="nav nav-tabs" id="dgFileTabs" data-toggle="tabs">
			<li class="active">
				<a href="#dg_0">
				<h5 class="block-title">项目组独立性声明</h5>
				</a>
			</li>
		</ul>
	</div>
	<div class="block-content block-content-full" style="padding: 0px;">
		<div class="tab-content" id="dgFileTabContent"></div>
	</div>
</div>
<%--</div>--%>
<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp" %>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/designer.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/reportIndependence.js"></script>
<script>
	$(document).ready(() => {
		ReportIndependence({
			region: '#iframe_dg_1', data: {
				source: null,
				fileName: "项目组独立性声明"
			}
		});
	});

</script>
</body>
</html>