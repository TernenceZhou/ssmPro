<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<div class="content bdo-page-content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#modify_tab_direction"
				id="modal_direction_save_through2">科目方向修正</a></li>
			<li><a href="#modify_tab_profit" id="modal_profit_save_through2">本年利润对方科目修正</a>
			<li><a href="#modify_tab_transfer"
				id="modal_transfer_save_through2">结转科目修正</a>
			<li><a href="#modify_tab_sapsubject"
				id="modal_sapsubject_save_through2">科目编号层级修正</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option"
							data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_detailaccount_content">
			<div class="tab-pane active" id="modify_tab_direction">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="modify_direction_search" type="button">
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
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control"
												id="modify_customerId" style="width: 100%;">
												<option></option>
											</select> <label for="modify_customerId">客户</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="modify_yyyy" class="form-control date-picker"
												type="text"> <label for="modify_yyyy">年份</label>
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
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								科目方向一览<span name="cus_select"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="modify_directiontable"
								class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="modify_tab_profit">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="modify_profit_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="modify_profit_update" type="button">
										<i class="fa fa-legal" style="color: white;">&nbsp;对方科目修复</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control"
												id="modify_profit_customerId" style="width: 100%;">
												<option></option>
											</select> <label for="modify_profit_customerId">客户</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="modify_profit_yyyy"
												class="form-control date-picker" type="text"> <label
												for="modify_profit_yyyy">年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text"
												id="modify_profit_subjectid"> <label
												for="modify_profit_subjectid">科目编号</label>
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
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								凭证一览<span name="cus_select"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="modify_profittable"
								class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="modify_tab_transfer">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="modify_transfer_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="modify_transfer_set" type="button">
										<i class="fa fa-legal" style="color: white;">&nbsp;设置结转科目</i>
									</button>
								</li>
								<li>
									<button id="modify_transfer_cancel" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;取消结转科目</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control"
												id="modify_transfer_customerId" style="width: 100%;">
												<option></option>
											</select> <label for="modify_transfer_customerId">客户</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="modify_transfer_yyyy"
												class="form-control date-picker" type="text"> <label
												for="modify_transfer_yyyy">年份</label>
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
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								结转凭证一览<span name="cus_select"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="modify_transfer_table"
								class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="modify_tab_sapsubject">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="modify_sapsubject_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="modify_sapsubject_set" type="button">
										<i class="fa fa-legal" style="color: white;">&nbsp;设置科目编号层级</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control"
												id="modify_sapsubject_customerId" style="width: 100%;">
												<option></option>
											</select> <label for="modify_sapsubject_customerId">客户</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="modify_sapsubject_yyyy"
												class="form-control date-picker" type="text"> <label
												for="modify_sapsubject_yyyy">年份</label>
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
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								SAP科目一览<span name="cus_select"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="modify_sapsubject_table"
								class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modify_modal_edit" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false">
	<div class="modal-sm modal-dialog" style="width: 500px">
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
					<h3 class="block-title">科目方向调整</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="modify_modal_edit_subject" class="form-control"
									type="text" data-result="" disabled> <label
									for="modify_modal_edit_subject">科目</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="form-control" id="modify_modal_edit_direction">
									<option></option>
								</select> <label for="modify_modal_edit_direction">方向</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button"
					id="modify_modal_edit_save">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-primary" type="button"
					data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_modify_subjectid" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px; z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_modify_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput_modify"
						placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_modify_subjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_modify_subjectid_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_modify_transfer_subjectid"
	tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px; z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_modify_transfer_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text"
						id="searchInput_transfer_modify" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_modify_transfer_subjectid_sure">
						<i class="fa fa-send"></i><span>&nbsp;设置</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_modify_sapsubject_setlevel"
	tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px;">
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
					<h3 class="block-title">设置科目编号层级</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="row" id="modal_modify_sapsubject_setlevel_row">
					<div class="form-group"></div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="modal_modify_sapsubject_setlevel_subjectId"
									class="form-control " type="text" disabled> <label
									for="modal_modify_sapsubject_setlevel_subjectId">科目编号</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-error">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="modal_modify_sapsubject_setlevel_level"
									class="form-control " type="text" placeholder="以 - 隔开, 如4-10"
									value="4-10"> <label
									for="modal_modify_sapsubject_setlevel_level">科目编号层级</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="modal_modify_sapsubject_setlevel_separ"
									class="form-control " type="text" placeholder="如 -" value="-">
								<label for="modal_modify_sapsubject_setlevel_separ">科目名称分隔符</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<img src="img/bdo/科目层级对照图.png" style="width: 100%;">
				</div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-12">
					<button class="btn btn-md btn-warning" type="button"
						id="modal_modify_sapsubject_setlevel_save">
						<i class="fa fa-arrow-circle-o-right"></i><span>&nbsp;下一步</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_modify_sapsubject_subjecttree"
	tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px;">
	<div class="modal-dialog modal-lg">
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
					<h3 class="block-title">设置科目树</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<table id="modal_modify_sapsubject_subjecttree_table"
					class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<div class="col-sm-12">
					<button class="btn btn-md btn-danger" type="button"
						id="modal_modify_sapsubject_subjecttree_save">
						<i class="fa fa-save"></i><span>&nbsp;保存</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<script
	src="${pageContext.request.contextPath}/finCenter/finDataModify.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
<script
	src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>