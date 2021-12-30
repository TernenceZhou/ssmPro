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
	<%@ include file="/dgCenter/common/spreadJS14.0.6.css.jsp" %>
	<script src="${pageContext.request.contextPath}/assets/js/core/jquery.min.js"></script>
	<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp" %>
	<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
</head>
<body>
	<div id='xlsx' style='width:100%; height:705px;'></div>

	<script>
		var excelIo = new GC.Spread.Excel.IO();
		var xhr = new XMLHttpRequest();
		let url = "dgCenter/DgMain.previewProjDgFile.json" + window.location.search;
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status == 200) {
				let blob = this.response;
				excelIo.open(blob, function (json) {
					let spread = new GC.Spread.Sheets.Workbook(document.getElementById('xlsx'));
					var workbookObj = json;
					spread.fromJSON(json);
				}, function (e) {
					console.error(e);
				}, {});
			}
		};

		xhr.send();
	</script>
</body>
</html>