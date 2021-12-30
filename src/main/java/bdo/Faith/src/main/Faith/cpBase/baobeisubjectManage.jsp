<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs">
				<li class="active"><a href="#tab_template_browse">报表模板一览</a></li>
				<li ><a href="#tab_template" style="display:none">报备模板对照&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>
				<li><a href="#tab_subjectcomser">报备模板维护</a></li>
			</ul>
			<div class="block-content tab-content">
				<div class="tab-pane active" id="tab_template_browse">
					<div class="content">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="com_template_search" type="button">
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
							<div id="template_search_condition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_vocationId">模板类型</label>
												<select class="js-select2 form-control" id="template_type"  style="width: 100%;">
												</select>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_vocationId">状态</label>
												<select class="js-select2 form-control" id="template_active_flag"  style="width: 100%;">
													<option value="1" selected>未作废</option>
													<option value="0">已作废</option>
												</select>
											</div>
										</div>
									</div>
									<!-- 
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="tempid">模板</label>
												<input class="form-control" type="text" data-result="" data-content="" id="tempid" name="jnsubject" value="">
								
											</div>
										</div>
									</div> -->
								</div>
							</div>
						</div>
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
								</ul>
								<h3 class="block-title">模板一览</h3>
							</div>
							<div class="block-content">
								<table id="all_template_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_template">
					<div class="content">
						<div class="block block-themed ">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="autoContract" type="button">
											<i class="fa fa-book" style="color: white;">&nbsp;自动对照</i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报表模板<span id="template_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="comtemplate_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_subjectcomser">
					<div class="content">
						<div class="block block-themed  block-opt-hidden">
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
										<div class="col-sm-4">
											<div class="form-material">
												<label for="template_vocationId">报备模板选择</label>
												<select class="js-select2 form-control" id="baobeiTemplateTypeSelect"  style="width: 100%;">
													<option></option>
												</select>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_vocationId">报表种类选择</label>
												<select class="js-select2 form-control" id="tableDivSelect"  style="width: 100%;">
													<option></option>
												</select>
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
											<i class="fa fa-plus" style="color: white;" title="新增字段"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报备模板科目</h3>
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
						<h3 class="block-title">新增/修改字段</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comsub_form"></form>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modal_baobeitemplateform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">报备模板选择</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="baobeiTemplateSelect"></form>
				</div>
			</div>
		</div>
	</div>


	<div class="modal fade" id="modal_comtemplatecolEditform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">报表项对照报备模板</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="baobeiReferenceEdit_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comtemplatecoladdform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">添加报表项</h3>
					</div>
				</div>
				<!--<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecoladd_form"></form>
				</div>-->
				<div class="block-content">
					<table id="comsubjectadd_table" class="table table-bordered table-striped table-hover">
					</table>
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
<script src="${pageContext.request.contextPath}/cpBase/baobeisubjectManage.js"></script>