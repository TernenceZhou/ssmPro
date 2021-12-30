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
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
	<title></title>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>

	<!-- Page JS Code -->
	<%--<script src="${pageContext.request.contextPath}/bdolx/main/main.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/menu.js"></script>--%>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/side.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
	<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
</head>
<body>
<div>

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
		// http://localhost:8081/Faith/aptView.do?m=aptView&projectId=2021045617&indexId=1012-0001-0001&fileType=1
		// 2021045617
		var projectId = getQueryString('projectId');
		// 1012-0001-0001
		var indexId = getQueryString('indexId');
		// 1：底稿 2：底稿附件
		var fileType = getQueryString('fileType');
		if(fileType == 1){
			$.ajax({
				url: 'aptView/AptViewMain.queryDgFile.json',
				type: 'post',
				data: {
					param1: projectId,
					param2: indexId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var rowData = data.data[0];
						var nodeData = {
							extraOptions: rowData,
							currentNode: {
								extraOptions: rowData
							},
							menuId: window.sys_menuId
						};
						$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
						window.location.href = '/Faith/aptView.do?m=aptViewDg&index=' + rowData.indexId + '&projectId=' + rowData.projectId;
						// window.open('/Faith/aptView.do?m=aptViewDg&index=' + rowData.indexId + '&projectId=' + rowData.projectId);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}else if(fileType == 2){
			$.ajax({
				url: 'aptView/AptViewMain.queryAttachFile.json',
				type: 'post',
				data: {
					param1: projectId,
					param2: indexId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var rowData = data.data[0];
						var fileSuffix = rowData.suffix.toLowerCase();
						var fileSuffix = rowData.fileName.substring(rowData.fileName.lastIndexOf(".") + 1).toLowerCase();
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.fileName ,rowData.fileName , 'location=no');
						} else if (fileSuffix === "xlsx"){
							rowData.pageType = 1;
							var nodeData = {
								extraOptions: rowData,
								currentNode: {
									extraOptions: rowData
								},
								menuId: window.sys_menuId
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.location.href = '/Faith/dgcenter.do?m=previewFile';
							// window.open('/Faith/dgcenter.do?m=previewFile');
						}else{
							downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: rowData.autoId, param2: rowData.customerId, param3: 'type1'});
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
	});

</script>
</body>
</html>