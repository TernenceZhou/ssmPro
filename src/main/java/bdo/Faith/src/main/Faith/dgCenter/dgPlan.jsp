<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">

<div class="spread-content">
	<div class="col-xs-3 spread-content-dir">
		<div class="row">
			<!-- Collapsed Tree -->
			<div id="spreadContentDir" class="block block-bordered"
				 style="margin-bottom: 0px;overflow-x: scroll;overflow-y: hidden;">
				<div class="block-header">
					<h3 class="block-title  dg-mulu">目录</h3>
				</div>
				<div class="block-content dg-tree">
					<!-- Tree View Container -->
					<div class="js-tree-collapsed"></div>
				</div>
			</div>
			<!-- END Collapsed Tree -->
		</div>
	</div>
	<div class="col-xs-9 spread-content-file">
		<div class="row">
			<div class="block block-bordered " id="contentBlock" style="position: relative;margin-bottom: 0px;">
				<div class="block-header">
					<div class="block-options block-options-left">
						<button id="toggleDir" type="button" class="btn btn-xs btn-primary push-5-r">
							<i class="toggle-dir-icon si si-arrow-left"></i>
						</button>
					</div>
					<ul class="block-options">
						<li>
							<button id="fullscreenBtn" type="button" class=" push-5-r">
								<i class="si si-size-fullscreen"></i>
							</button>
						</li>
					</ul>
				</div>
				<div id="subPageRight"></div>
			</div>
		</div>
	</div>
</div>
<div id="sideRegin"></div>
<script type="text/javascript">
	var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
	if (!jQuery.isNumeric(userLevel)) {
		userLevel = '0';
	}
</script>
<link rel="stylesheet" type="text/css"
	  href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
<link rel="stylesheet" type="text/css"
	  href="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.css">

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoSide.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/editProgram.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/subjectPlan.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/dgRcs.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/auditProgramPlan.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/otherAuditProgramPlan.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/materiality.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/attachList.js"></script>

<script src="${pageContext.request.contextPath}/dgCenter/dgPlan.js"></script>