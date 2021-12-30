<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">
<!-- <div class="content bg-gray-lighter">
	<div class="row items-push">
		<div class="col-sm-7">
			<h1 id="page_head" class="page-heading"></h1>
		</div>
		<div class="col-sm-5 text-right hidden-xs">
			<ol id="page_title" class="breadcrumb push-10-t">
			</ol>
		</div>
	</div>
</div> -->
<div class="content" id="contentBlock">
	<!-- <div class="block block-themed">
		<div class="block-header bg-primary">
			<ul class="block-options">
				<li>
					<button id="searchBtn" type="button"><i class="fa fa-search">&nbsp;搜索</i></button>
				</li>
				<li>
					<button id="searchResetBtn" type="button"><i class="fa fa-circle-o">&nbsp;重置</i></button>
				</li>
				<li>
					<button type="button" data-toggle="block-option" data-action="content_toggle"><i class="si si-arrow-up"></i></button>
				</li>
			</ul>
			<h3 class="block-title">搜索条件</h3>
		</div>
		<div class="block-search">
			<div class="row" data-form="search">
				<form id="searchForm" ></form>
			</div>
		</div>
	</div> -->
	<div class="block block-themed">
		<div class="block-header bg-primary">
			<ul class="block-options">
				<li>
					<button id="newSubjectBtn" type="button"><i class="fa fa-plus">&nbsp;新增</i></button>
				</li>
				<li>
					<button id="refreshSubjectBtn" type="button"><i class="fa fa-refresh">&nbsp;刷新</i></button>
				</li>
			</ul>
			<h3 class="block-title">科目</h3>
		</div>
		<div class="block-content">
			<table id="subjectTable" class="table table-bordered table-striped table-hover"></table>
		</div>
	</div>
</div>
<div class="modal fade" id="editSubjectModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" style="margin-top: 150px;">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title"></h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="subjectForm"></form>
			</div>
			
		</div>
	</div>
</div>
<%--<script type="text/javascript">
var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
if(!jQuery.isNumeric(userLevel)){
	userLevel = '0';
}
</script>--%>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>--%>
<script src="${pageContext.request.contextPath}/cpBase/subject.js"></script>