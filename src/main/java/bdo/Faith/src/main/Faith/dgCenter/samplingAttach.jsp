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
	<title></title>
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
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

		// http://localhost:8090/Faith/dgcenter.do?m=previewDgAttach&fileName=测试.pdf&projectId=2017059353&autoId=50&customerId=10002136
		var autoId = getQueryString('autoId');
		var customerId = getQueryString('customerId');
		var projectId = getQueryString('projectId');
		var $div = $('<iframe src="dgCenter/DgAttach.onlineSamplingAttachPreview.json?param1=' + autoId + '&param2=' + customerId + '&param3=' + projectId + '" allowfullscreen="true"  width="100%" height="99%" style="border: none;" onload="resize(this)"></iframe>');
		$('#mainContent').append($div);
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