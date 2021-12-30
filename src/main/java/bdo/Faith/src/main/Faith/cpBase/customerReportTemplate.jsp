<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<%@ include file="/cpBase/templateDetail.jsp"%>
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
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_template">
				<li class="active"><a href="#tab_custemplate">报表模板</a></li>
				<li><a href="#tab_subjectcomser">报表科目</a></li>
			</ul>
			<div class="block-content tab-content" id ="tab_template_content">
				<div class="tab-pane active" id="tab_custemplate">
					<div class="content">
						<div class="block block-bordered">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="custemplate_add" type="button">
											<i class="fa fa-plus" style="color: white;">&nbsp;自定义模板</i>
										</button>
									</li>
									<!--<li>
										<button id="comtemplatecol_add" type="button">
											<i class="fa fa-plus" style="color: white;">&nbsp;添加报表项</i>
										</button>
									</li>  -->
									
								</ul>
								<h3 class="block-title">报表模板<span id="template_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="custemplate_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
		
				<div class="tab-pane" id="tab_subjectcomser">
					<div class="content">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="comsubject_search" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">查询条件设定</h3>
							</div>
							<div id="search-condition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="comsubject_id">
												<label for="comsubject_id">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="comsubject_namme">
												<label for="comsubject_namme">科目名称</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="block block-bordered">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="comsubject_plus" type="button">
											<i class="fa fa-plus" style="color: white;" title="自定义报表项"></i>
										</button>
									</li>
									<li>
										<button id="comsubject_addtotemplate" type="button">
											<i class="fa fa-paper-plane" style="color: white;" title="添加到模板"></i>
										</button>
									</li>
									<li>
										<button id="comsubject_export" type="button">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报表科目</h3>
							</div>
							<div class="block-content">
								<table id="comsubject_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comsubform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comsub_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_custemplateform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">新增模板</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="custemplate_form"></form>
				</div>
			</div>
		</div>
	</div>

	
	<div class="modal fade" id="modal_seltemplate" tabindex="-1" role="dialog"
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
						<h3 class="block-title">模板选择</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="seltemplate_templateId">
										<option></option>
									</select><label for="import_vocationId">报表模板</label>
								</div>
								
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="addtotemplate_ok">
						<i class="fa fa-check"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
					</button>
				</div>
			</div>
		</div>
	</div>
<script src="${pageContext.request.contextPath}/cpBase/customerReportTemplate.js"></script>