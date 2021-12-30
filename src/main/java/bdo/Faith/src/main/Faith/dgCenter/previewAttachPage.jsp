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
		if (sys_userId == '') {
			sys_userId = window.CUR_USERID;
		}
	</script>--%>
</head>
<body>
<div>
	<div class="col-sm-3" style="padding-left: 0px;padding-right: 5px;height: 100%;">
		<div id="mainContent1" style="border: 1px solid skyblue;"></div>
	</div>
	<div class="col-sm-9" style="padding-left: 5px;padding-right: 0px;">
		<div id="sideRegin" style="border: 1px solid skyblue;display: none;"></div>
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

<script src="${pageContext.request.contextPath}/dgCenter/js/dg/previewAttachPage.js"></script>

<script>
	$(document).ready(() => {
		$('#mainContent1').css("height", window.innerHeight - 1);
		var mapData = JSON.parse($.sessionStorage('attachPageNode'));
		if (mapData) {
			var mapType = mapData.mapType;
			if(mapType == 'sampling'){
				document.title = '抽凭附件';
			}else if(mapType == 'singleLink'){
				document.title = '底稿附件';
			}
			PreviewAttachPage({region: '#mainContent1', data: mapData});
		}
	});
	function resize(obj){
		// 图片最大宽度
		var maxWidth = $(obj).width();
		// 图片最大高度
		var maxHeight = $(obj).height();
		// 缩放比例
		var ratio = 0;
		// 图片实际宽度
		var width = $($(obj).contents().find('img')[0]).width();
		// 图片实际高度
		var height = $($(obj).contents().find('img')[0]).height();
		// 检查图片是否超宽
		if (width > maxWidth) {
			// 计算缩放比例
			ratio = maxWidth / width;
			// 设定实际显示宽度
			$($(obj).contents().find('img')[0]).css("width", maxWidth);
			// 计算等比例缩放后的高度
			height = height * ratio;
			// 设定等比例缩放后的高度
			$($(obj).contents().find('img')[0]).css("height", height);
		}

		// 检查图片是否超高
		if (height > maxHeight) {
			// 计算缩放比例
			ratio = maxHeight / height;
			// 设定实际显示高度
			$($(obj).contents().find('img')[0]).css("height", maxHeight);
			// 计算等比例缩放后的高度
			width = width * ratio;
			// 设定等比例缩放后的高度
			$($(obj).contents().find('img')[0]).css("width", width * ratio);
		}
	}
</script>
</body>
</html>