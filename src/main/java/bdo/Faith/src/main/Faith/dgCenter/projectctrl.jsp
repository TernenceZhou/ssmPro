<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">

<div class="block-content" id="projectCtrlPage">
	<div class="row">
		<div class="col-lg-6">
			<div class="block block-themed">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button id="selectProjectBtn" type="button"><i class="fa fa-scribd"> 切换项目</i></button>
						</li>
						<li>
							<button id="refreshProjectInfoBtn" type="button"><i class="fa fa-refresh"> 刷新</i></button>
						</li>
					</ul>
					<h3 class="block-title">基本信息</h3>
				</div>
				<div class="block-content">
					<form id="projectInfoForm"></form>
				</div>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="block block-themed">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button id="saveSettingInfoBtn" type="button"><i class="fa fa-save"> 保存</i></button>
						</li>
						<li>
							<button id="refreshSettingInfoBtn" type="button"><i class="fa fa-refresh"> 刷新</i></button>
						</li>
					</ul>
					<h3 class="block-title">基本设置</h3>
				</div>
				<div class="block-content">
					<form id="projectDgSettingForm"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			<div class="block block-themed">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button id="resetProjectDgBtn" type="button"><i class="fa fa-repeat"> 重置项目</i></button>
						</li>
						<li>
							<button id="refreshStateBtn" type="button"><i class="fa fa-refresh"> 刷新</i></button>
						</li>
					</ul>
					<h3 class="block-title">底稿完成状态</h3>
				</div>
				<div class="block-content">
					<table id="dgFinishedTable"></table>
				</div>
			</div>
		</div>
	</div>
</div>

<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoSide.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/projectctrl.js"></script>
