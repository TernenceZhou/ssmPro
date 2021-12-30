<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<a id="viewFinManual"
	style="position: absolute; right: 100px; top: 85px; z-index: 10000; color: red; font-size: medium; cursor: pointer; text-decoration: underline;"><i
	class="fa fa-file-pdf-o"></i>&nbsp;数据导入常见问题</a>
<div id="dxnFrame"></div>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
<script>
	$(function() {
		let $iframe = '<iframe id="dxnFrameId" name="dxnFrameName" '
				+ 'src="'
				+ window.dxnUrl
				+ '/login/dxnurl?systemid=Dxn&token='
				+ window.dxntoken
				+ '&loginid='
				+ window.dxnloginid
				+ '" scrolling="auto" frameborder="0" width="100%" height="800"></iframe>';
		$('#dxnFrame').replaceWith($($iframe));

		$('#viewFinManual').click(function() {
			window.open('finCenter/FinAccImportJS.viewFinManual.json', '', 'location=no');
		});
	});
</script>