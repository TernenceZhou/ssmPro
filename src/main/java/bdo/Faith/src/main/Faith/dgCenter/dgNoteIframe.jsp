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
		.main-content.aside-left {
			position: relative;
			left: 0;
			top: 40px;
			height: 100vh;
		}
		.gc-sjsdesigner-dialog.gc-designer-root.cn .container{
			width: 100%;
		}
	</style>
</head>
<body>

<div id="mainContent2" class="main-content aside-left"></div>

<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp" %>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/designer.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/secondNote.js"></script>

<script>
	$(document).ready(() => {
		var nodeData = JSON.parse($.sessionStorage('excelnode'));
		if (nodeData) {
			window.sys_menuId = nodeData.menuId;
			SecondNotePage({region: '#mainContent2', data: nodeData});
			$('#dgFileTabs a', window.parent.document).click(function(e) {
				e.preventDefault();
				jQuery(this).tab('show');
				var id = this.getAttribute('href').replace('#', '');
				$("#dgFileTabContent div", window.parent.document).removeClass("active");
				$('#' + id, window.parent.document).addClass("active");
			});
			$('.tab-close', window.parent.document).on('click', function(ev) {
				var ev = window.event || ev;
				ev.stopPropagation();
				//先判断当前要关闭的tab选项卡有没有active类，再判断当前选项卡是否最后一个，如果是则给前一个选项卡以及内容添加active，否则给下一个添加active类
				var gParent = $(this).parent().parent().parent();
				var showId = null;
				if (gParent.hasClass('active')) {
					if (gParent.index() == gParent.length) {
						gParent.prev().addClass('active');
						showId = gParent.prev().children().attr('href').substring(1);
					} else {
						gParent.next().addClass('active');
						if (gParent.next().length !== 0) {
							showId = gParent.next().children().attr('href').substring(1);
						}
					}
					if (showId !== null) {
						$('[href="#' + showId + '"]', window.parent.document).tab('show');
						$("#" + showId, window.parent.document).addClass("active");
					}
				}
				gParent.remove();
				var id = $(this).parent().parent().attr('href').substring(1);
				$('#' + id, window.parent.document).remove();
			});
		}
	});

</script>
</body>
</html>