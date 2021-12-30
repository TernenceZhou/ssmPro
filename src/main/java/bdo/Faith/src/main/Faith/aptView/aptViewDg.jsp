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
<div>
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
	<div style="position: absolute; top: 5px; right: 50px; z-index: 1001;">
		<label id="tagLabel" style="margin-right: 20px;font-weight: bold;font-size: 18px;"></label>
	</div>
</div>
<script>
	$(document).ready(() => {
		if (window.nodeData == null) {
			window.nodeData = JSON.parse($.sessionStorage('subjecttreeNode'));
			window.nodeData.nodeType = 'dg';
		}
		if (nodeData) {
			// 1002-0001-0001-银行存款明细余额表.xlsx
			var fileName = nodeData.extraOptions.nodeName;
			var indexId = nodeData.extraOptions.indexId;
			document.title = fileName.replace(indexId, '').substring(1).replace('.xlsx', '');
			window.sys_menuId = nodeData.menuId;
			var $div = $('<iframe id="iframe_dg_' + nodeData.extraOptions.workpaperId + '" src="/Faith/aptView.do?m=aptViewDgMain&index=' + nodeData.extraOptions.indexId + '" allowfullscreen="true" scrolling="no" width="100%" height="100%" style="border: none;"></iframe>');
			$('#mainContent').append($div);
			$('body').removeClass('aside-hide');
			$('#hidPostil').click(event => {
				event.preventDefault();
				$('body').toggleClass('aside-hide');
				$(window).resize();
			});
			$('#hidPostil').click();
		}
		/* window.onunload = onunload_handler;
		function onunload_handler(){
			debugger;
			$.ajax({
				url: 'aptView/AptViewMain.queryAttachFile.json',
				type: 'post',
				async: false,
				data: {
					param1: projectId,
					param2: indexId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$.sessionStorage('userNm', selfNm);
						$.sessionStorage('loginId', loginId);
						window.parent.location.href = 'bdologin.do?m=exitSystem';
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
			debugger;
		} */
	});

</script>
</body>
</html>