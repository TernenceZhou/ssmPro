<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<a id="viewFinManual"
	style="position: absolute; right: 100px; top: 85px; z-index: 10000; color: red; font-size: medium; cursor: pointer; text-decoration: underline;"><i
	class="fa fa-file-pdf-o"></i>&nbsp;数据导入常见问题</a>
<div id="edataFrame"></div>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
<script>
	$(function() {
		let $iframe = '<iframe id="edataFrameId" name="edataFrameName" '
				+ 'src="'
				+ window.edataUrl
				+ '/AuditSystem/bdo.do?method=dataUpload&systemid=Edata&token='
				+ window.edatatoken
				+ '&loginid='
				+ window.edataloginid
				+ '" scrolling="auto" frameborder="0" width="100%" height="800"></iframe>';
		$('#edataFrame').replaceWith($($iframe));

		$('#viewFinManual').click(
				function() {
					window.open('finCenter/FinAccImportJS.viewFinManual.json',
							'', 'location=no');
				});
	});
</script>