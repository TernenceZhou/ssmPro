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
		.main-content.aside-right {
			position: absolute;
			left: 15vw;
			right: 0;
			height: 100vh;
		}

		.aside-left {
			position: absolute;
			width: 15vw;
			left: 0px;
			height: 100vh;
		}

		.aside-left .aside-left-context {
			position: absolute;
			width: 100%;
			left: 0px;
			height: 100vh;
		}

		.aside-left .aside-left-context .bdo-side.in {
			-webkit-box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 0.3);
			box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 0.3);
			-webkit-transform: translateX(0) translateY(0) translateZ(0);
			-ms-transform: translateX(0) translateY(0);
			transform: translateX(0) translateY(0) translateZ(0);
			width: 100% !important;
			top: 0px;
			position: absolute;
			z-index: 2;
			right: 0px;
		}

		.aside-mid {
			position: absolute;
			z-index: 3;
			right: 85vw;
			height: 100vh;
			width: 15px;
		/ / background-color: #bae1ef;
		}

		.aside-mid .aside-icon {
			position: absolute;
			top: 50vh;
			margin-top: -50%;
			text-align: center;
			width: 100%;
		}

		.aside-mid .aside-icon i.fa {
			transform: scale(1, 4);
		}

		.aside-mid .aside-icon .fa-angle-right {
			display: none;
		}

		.aside-hide .aside-mid .aside-icon .fa-angle-right {
			display: inline-block;
		}

		.aside-hide .aside-mid .aside-icon .fa-angle-left {
			display: none;
		}

		.aside-hide .aside-mid {
			right: 100vw;
			margin-right: -15px;
		}

		.aside-hide .main-content.aside-right {
			left: 15px;
		}

		.aside-hide .aside-left {
			display: none;
		}

		#hidPostil {
			cursor: pointer;
		}

		.aside-hide {
			width: 99.9vw;
		}
	</style>
</head>
<body>
<div>
	<div id="sideRegin" class="main-content aside-right"></div>
	<div id="hidPostil" class="aside-mid" style="cursor: pointer;">
		<div class="aside-icon">
			<i class="fa fa-angle-right"></i>
			<i class="fa fa-angle-left"></i>
		</div>
	</div>
	<div class="aside-left">
		<div id="mainContent" class="aside-left-context">
		</div>
	</div>
</div>

<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/RowGroup/js/dataTables.rowGroup.js" type="text/javascript"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoSide.js"></script>--%>

<script src="${pageContext.request.contextPath}/tote/js/examFileView.js"></script>
<script>
	$(document).ready(() => {
		var nodeData = JSON.parse($.sessionStorage('fileViewNode'));
		if (nodeData) {
			window.sys_menuId = nodeData.menuId;
			ExamFileViewPage({region: '#mainContent', data: nodeData});
			$('body').removeClass('aside-hide');
			$('#hidPostil').click(event => {
				event.preventDefault();
				$('body').toggleClass('aside-hide');
				$(window).resize();
			});
			// $('#hidPostil').click();
		}
	});

</script>
</body>
</html>