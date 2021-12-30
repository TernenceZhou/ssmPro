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
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<%@ include file="/cpShare/partnerModal.jsp" %>

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
	<style>
		.main-content.aside-left {
			position: absolute;
			right: 40vw;
			left: 0;
			height: 100vh;
		}

		.aside-right {
			position: absolute;
			width: 40vw;
			right: 0px;
			height: 100vh;
		}

		.aside-right .aside-right-context {
			position: absolute;
			width: 100%;
			right: 0px;
			height: 100vh;
		}

		.aside-right .aside-right-context .bdo-side.in {
			-webkit-box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 0.3);
			box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 0.3);
			-webkit-transform: translateX(0) translateY(0) translateZ(0);
			-ms-transform: translateX(0) translateY(0);
			transform: translateX(0) translateY(0) translateZ(0);
			width: 100% !important;
			top: 0px;
			position: absolute;
			z-index: 2;
			left: 0px;
		}

		.aside-mid {
			position: absolute;
			z-index: 3;
			left: 60vw;
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

		.aside-mid .aside-icon .fa-angle-left {
			display: none;
		}

		.aside-hide .aside-mid .aside-icon .fa-angle-left {
			display: inline-block;
		}

		.aside-hide .aside-mid .aside-icon .fa-angle-right {
			display: none;
		}

		.aside-hide .aside-mid {
			left: 100vw;
			margin-left: -15px;
		}

		.aside-hide .main-content.aside-left {
			right: 15px;
		}

		.aside-hide .aside-right {
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

<div id="mainContent" class="main-content aside-left">

</div>
<div id="hidPostil" class="aside-mid" style="cursor: pointer;">
	<div class="aside-icon">
		<i class="fa fa-angle-left"></i>
		<i class="fa fa-angle-right"></i>
	</div>
</div>
<div class="aside-right">
	<div id="dgFile" class="aside-right-context">
		<div>
			<div style="position: absolute">
				<ul class="nav nav-tabs" id="dgFileTabs" data-toggle="tabs"></ul>
			</div>
			<div class="block-content block-content-full" style="padding: 0px;">
				<div class="tab-content" id="dgFileTabContent"></div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<script>
	$(document).ready(() => {
		if (window.nodeData == null) {
			try {
				if (typeof JSON.parse($.sessionStorage('mergeNoteInfoNode')) == "object") {
					window.nodeData = JSON.parse($.sessionStorage('mergeNoteInfoNode'));
				}
			} catch(e) {
				window.nodeData = $.sessionStorage('mergeNoteInfoNode');
			}
			window.nodeData.nodeType = 'mergeNote';
		}
		if (nodeData) {
			var fileName = nodeData.extraOptions.fileName;
			document.title = fileName.replace('.xlsx', '');
			window.sys_menuId = nodeData.menuId;
			var $div = $('<iframe id="iframe_mergeNote_' + nodeData.extraOptions.autoId + '" src="/Faith/dgcenter.do?m=openMergeNoteInfoMain&noteNo=' + nodeData.extraOptions.noteNo + '" allowfullscreen="true" scrolling="no" width="100%px" height="100%" style="border: none;"></iframe>');
			$('#mainContent').append($div);
			$('body').removeClass('aside-hide');
			$('#hidPostil').click(event => {
				event.preventDefault();
				$('body').toggleClass('aside-hide');
				$(window).resize();
			});
			$('#hidPostil').click();
		}
	});
</script>
</body>
</html>