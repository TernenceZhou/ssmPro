<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/select2/select2.min.css">
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
<style>
	#s_userablePlate .select2-selection__choice {
		background-color: #5c90d2 !important;
		border: 1px solid #5c90d2 !important;
	}
</style>
<div class="content" id="contentBlock">
	<div class="block block-themed block-opt-hidden">
		<div class="block-header bg-primary">
			<ul class="block-options">
				<li>
					<button id="searchBtn" type="button"><i class="fa fa-search">&nbsp;搜索</i></button>
				</li>
				<li>
					<button id="searchResetBtn" type="button"><i class="fa fa-repeat">&nbsp;重置</i></button>
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
	</div>
	<div class="block block-themed">
		<div class="block-header bg-primary">
			<ul class="block-options">
				<li>
					<button id="importProgramBtn" type="button"><i class="si si-cloud-upload" title="批量导入审计程序"></i></button>
				</li>
				<li>
					<button id="exportProgramBtn" style="border: 0px;background-color: #5c90d2;"><i class="si si-cloud-download" title="导出"></i></button>
				</li>
				<li>
					<button id="newAuditprogramBtn" type="button"><i class="fa fa-plus" title="新增"></i></button>
				</li>
			</ul>
			<h3 class="block-title">标准审计程序</h3>
		</div>
		<div class="block-content">
			<table id="auditprogramTable" class="table table-bordered table-striped table-hover"></table>
		</div>
	</div>
</div>
<div class="modal fade" id="editAuditprogramModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" style="margin-top: 150px;">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<%--<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>

					</ul>--%>
					<h3 class="block-title"></h3>

				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="auditprogramForm"></form>
			</div>

		</div>
	</div>
</div>

<div class="modal fade" id="chooseDifferentAuditModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" style="margin-top: 150px; ">
			<div class="modal-content" style="width:350px">
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
					<div class="row">
						<div class="form-group" style="text-align: center;">
							<div class="col-xs-6">
								<button id="auditProgramView" class="btn btn-md btn-success" type="button" data-dismiss="modal">
									标准科目
								</button>
							</div>
							<div class="col-xs-6">
								<button id="otherAuditProgramView" class="btn btn-md btn-success" type="button" data-dismiss="modal">
									其他科目
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
</div>

<div class="modal fade" id="chooseDifferentAuditModal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" style="margin-top: 150px;">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<%--<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>

					</ul>--%>
					<h3 class="block-title"></h3>

				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="auditprogramForm"></form>
			</div>

		</div>
	</div>
</div>


<div class="modal fade" id="modal_import_auditprogram" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
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
					<h3 class="block-title">导入标准审计程序</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<%--<form class="form-horizontal" id="auditprogram_template_Modal"></form>--%>
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="auditprogram_fileinput">标准审计程序数据</label>
						<div class="col-xs-12">
							<input id="auditprogram_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
							<div id="errorBlock" class="help-block"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="download_audit_template">
					<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
				</button>
				<button class="btn btn-md btn-primary" type="button" id="import_audit_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>


<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top:40px;z-index: 1070;">
		<div class="modal-dialog modal-md">
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
						<h3 class="block-title">选择行业</h3>
					</div>
				</div>
				<div class="modal-body" style="min-height:500px;max-height:500px">
					<div id="subject_tree"></div>
				</div>
				<div class="modal-footer">
                    <div class="col-sm-3">
                        <input class="form-control" type="text" id="searchInput1" placeholder="搜索行业">
                    </div>
                    <div class="col-sm-9">
                        <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_reset">
                            <i class="fa fa-repeat"></i><span>&nbsp;重置</span>
                        </button>
                        <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure">
                            <i class="fa fa-send"></i><span>&nbsp;确定</span>
                        </button>
                        <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure_addOrUpdate">
                            <i class="fa fa-send"></i><span>&nbsp;确定</span>
                        </button>
                        <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                            <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                        </button>
                    </div>
				</div>
			</div>
		</div>
	</div>



<script type="text/javascript">
var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
if(!jQuery.isNumeric(userLevel)){
	userLevel = '0';
}
</script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTreeIndustry.js"></script>--%>
<script src="${pageContext.request.contextPath}/cpBase/auditprogram.js"></script>