<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/dgCenter/common/journalAdjust.jsp" %>
<style>
	#example {
		text-align: center;
	}

	/* Table Head */
	#subtable thead th {
		background-color: rgb(81, 130, 187);
		color: #fff;
		border-bottom-width: 0;
		padding: 5px 10px;
	}

	/* Column Style */
	#subtable td {
		color: #000;

	}

	/* Heading and Column Style */
	#subtable tr, #table-7 th {
		border-width: 1px;
		border-style: solid;
		border-color: rgb(81, 130, 187);
	}

	/* Padding and font style */
	#subtable td, #table-7 th {
		padding: 5px 10px;
		font-size: 12px;
		font-family: Verdana;
	}

	#search_isInclude {
		visibility: hidden;
		position: absolute;
	}

	.width-jyx  {
		min-width: 352px;
		max-width: 352px;
	}
	.width-je  {
		min-width: 120px;
		max-width: 120px;
	}
	.width-seq  {
		height: 35px;
		min-width: 30px;
		max-width: 30px;
	}
	.width-code  {
		min-width: 60px;
		max-width: 60px;
	}
	.width-subject-id  {
		min-width: 100px;
		max-width: 100px;
	}
	.width-subject-name  {
		min-width: 200px;
		max-width: 200px;
	}
	.width-direction{
		min-width: 30px;
	}
	.swal-tb-formula-alert {
		max-height: 800px;
		/*max-width: 650px;*/
	}

</style>

<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div class="block">
		<div class="block-heade">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_contract">
				<li id="tab2" class="active"><a href="#tab_tbList">试算平衡表</a></li>
				<li id="tab1"><a href="#tab_tbContract">TB科目对照</a></li>
				<li id="tab3"><a href="#tab_tb_options">TB科目维护</a></li>
				<li><a href="#tab_adjustdetail" style="display:none">调整明细&nbsp;&nbsp;<i id="tb_tzmx"
																						class="fa fa-times-circle"></i></a>
				</li>
				<li><a href="#tab_carry-forward" style="display:none">设置结转&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a>
				</li>
				</i>
				<li class="pull-right">
					<ul class="block-options push-10-t push-10-r">
						<li>
							<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="block-content tab-content" id="tab_contract_content">
			<div class="tab-pane" id="tab_tbContract">
				<div class="block block-themed" id="subjectlist_block">
					<div class="block-header  bg-primary">
						<ul class="block-options" style="margin-top:-6px">
							<!-- <li>
								<input id="copy_temp" type="text">
							</li> -->
							<li style="width: 80px">
								<div class="block-options form-group has-info"
								     style="width: 170px; float: left;">
									<div class="form-material col-xs-8 col-sm-8 col-lg-8"
									     style="margin: 0px; width:60%">
										<label for="show_contrast"></label>
										<select class="form-control" id="show_contrast" name="filter" size="1" style="color: #fff; padding: 0px;">
											<option value="" style="color: black">全部</option>
											<option value="0" style="color: black">已对照</option>
											<option value="1" style="color: black">未对照</option>
										</select>
									</div>
								</div>
							</li>
							<li>
								<div class="block-options form-group has-info"
									 style="width: 265px; float: left;">
									<label class="col-xs-4 col-sm-4 col-lg-4 control-label"
										   for="selectYear"
										   style="text-align: right; padding-top: 4px; color: #fff; width:40%">选择年份:</label>
									<div class="form-material col-xs-8 col-sm-8 col-lg-8"
										 style="margin: 0px; width:60%">
										<select class="form-control" id="selectYear" name="filter"
												size="1" style="color: #fff; padding: 0px;">
										</select>
									</div>
								</div>
							</li>
							<li>
								<button id="btn_search" type="button">
									<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
								</button>
							</li>
							<li>
								<div class="dropdown open">
									<button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" style="background:none;margin:0 -6px 3px -5px;" aria-expanded="true" title="添加财务科目">
										<i class="fa fa-plus" style="color: white;"></i>
									</button>
									<ul class="dropdown-menu" style="min-width: 100px;font-size: 10px;">
										<li><a href="#" id="btn_user_subject">手动填写添加</a></li>
										<li><a href="#" id="btnAddUserSubjectByTree">按科目树选择添加</a></li>
										<li><a href="#" id="btnAddNcwfplr">添加年初未分配利润</a></li>
									</ul>
								</div>
							</li>
							<li>
								<button id="tb_refresh" type="button">
									<i class="fa fa-indent" style="color: white;" title="科目对照"></i>
								</button>
							</li>
							<li>
								<button id="tb_retrieve_financialdata" type="button">
									<i class="fa fa-undo" style="color: white;" title="重新获取财务数据"></i>
								</button>
							</li>
							<li>
								<button id="tb_reset_contract" type="button">
									<i class="fa fa-repeat" style="color: white;" title="重置"></i>
								</button>
							</li>
							<li>
								<button id="btn_export" type="button">
									<i class="si si-cloud-download" style="color: white;" title="导出"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
								</button>
							</li>
						</ul>
						<h3 class="block-title">TB科目映射</h3>
					</div>
					<div class="block-content">
						<table id="example" class="table table-bordered table-striped table-hover">
						</table>
					</div>
				</div>
			</div>
			<div class="tab-pane active" id="tab_tbList">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li style="width: 230px">
								<div class="block-options form-group has-info" style="width: 280px;float: left;">
									<label class="col-xs-4 col-sm-4 col-lg-4 control-label" for="tb_editer"
									       style="text-align: right;padding-top:4px;color: #fff;">TB编制人:</label>
									<div class="form-material col-xs-8 col-sm-8 col-lg-8" style="margin: 0;width: 110px">
										<select class="form-control" value="2" id="tb_editer" name="filter" size="1"
										        style="color: #fff;padding:0px;">
										</select>
									</div>
								</div>
							</li>
							<li style="width: 120px;">
								<div class="block-options form-group has-info" style="width: 150px;float: left;">
<%--									<label class="col-xs-4 col-sm-4 col-lg-4 control-label" for="showContract"--%>
<%--										   style="text-align: right;padding-top:4px;color: #fff;">显示方式:</label>--%>
									<div class="form-material col-xs-8 col-sm-8 col-lg-8" style="margin: 0px;">
										<select class="form-control" value="2" id="showContract" name="filter"
												size="1"
												style="color: #fff;padding:0px;">
											<option value="2" style="color: #000;" selected>全部</option>
											<option value="1" style="color: #000;">已对照</option>
											<option value="0" style="color: #000;">未对照</option>
										</select>
									</div>
								</div>
							</li>
							<li>
								<button id="tb_search" type="button">
									<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
								</button>
							</li>
							<li>
								<button id="tb_createReport" type="button">
									<i class="fa fa-table" style="color: white;" title="生成试算平衡表"></i>
								</button>
							</li>
							<li>
								<button id="tb_export" type="button">
									<i class="si si-cloud-download" style="color: white;" title="导出"></i>
								</button>
							</li>
							<li>
								<button id="tb_export_APT" type="button">
									<i class="fa fa-download" style="color: white;" title="导出APT-TB"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
								</button>
							</li>
						</ul>
						<h3 class="block-title">试算平衡表 <span id="title_index"></span></h3>
					</div>
					<div class="block-content">
						<table id="tb_tbcheck" class="table table-bordered table-striped table-hover">
						</table>
						<table id="tb_tab" class="table table-bordered table-striped table-hover">
						</table>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_tb_options">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal" id="user_tb_change" data-item-index="0">
									<i class="fa fa-exchange" title="切换"></i>
								</button>
							</li>
							<li>
								<button id="btn_tb_search" type="button">
									<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
								</button>
							</li>
							<li>
								<button id="comsubject_addtotemplate" type="button">
									<i class="si si-cloud-download" style="color: white;" title="另存为模板"></i>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal" id="user_tb_add">
									<i class="fa fa-plus" title="新增"></i>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal" id="tbSubject_sort">
									<i class="fa fa-list-ol" title="保存排序"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
								</button>
							</li>
						</ul>
						<h3 class="block-title">TB科目映射<%--<span id="cus_select1"></span>--%></h3>
					</div>
					<div class="block-content">
						<table id="user_tb_table" class="table table-bordered table-striped table-hover">
						</table>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_carry-forward">
				<div class="block block-themed block-opt-hidden">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="voucher_search" type="button">
									<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
								</button>
							</li>
							<li>
								<button id="voucher_clear" type="button">
									<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">根据所选条件查询</h3>
					</div>
					<div id="search-condition" class="block-search">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<input class="js-select2 form-control" id="search_customerId" readonly>
										</input> <label for="search_customerId">客户名称</label>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-2">
									<div id="search_dateGroup" class="form-material input-group">
										<select class="form-control" id="search_dateType"
												style="min-width: 40px;visibility: hidden;position: absolute;"
												readonly>
											<option value='2'>年</option>
										</select>
										<input id="search_startDate" class="form-control" size=10 type="text"
											   value="" style="min-width: 100px;" readonly>
										<input id="search_endDate" class="form-control" size=10 type="text" value=""
											   style="visibility: hidden;" readonly>
										<label for="search_dateType">查询日期</label>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-2">
									<div class="form-material input-group">
										<select class="form-control" id="search_isInclude" placeholder="是否包含"
												readonly>
											<option value='0'>含</option>
										</select>
										<input class="form-control" type="text" id="search_subjectId" readonly>
										<label for="search_subjectId">所选择科目编号</label>

									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-2">
									<div class="form-material">
										<input class="form-control" type="text" id="search_summery">
										<label for="search_summery">摘要</label>
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
								<button id="voucher_export" type="button">
									<i class="si si-cloud-download" style="color: white;" title="导出"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
								</button>
							</li>
						</ul>
						<h3 class="block-title">查询结果<span name="cus_select"></span></h3>
					</div>
					<div class="block-content">
						<table id="voucher_tab" class="table table-bordered table-striped table-hover">
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade  ui-draggable" id="modal-setRelation" tabindex="-1" role="dialog"
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
					<h3 class="block-title">科目对照</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<div class="col-sm-6">
							<div class="form-material">
								<input class="form-control" type="hidden" id="relation_autoId">
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-6">
							<div class="form-material">
								<input class="form-control" type="hidden" id="relation_vocationId">
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="relation_userSubjectYear" disabled="true">
								<label for="relation_userSubjectYear">对应年份</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="relation_userSubjectId" disabled="true">
								<label for="relation_userSubjectId">客户科目</label>
								<input class="form-control" type="hidden" id="relation_userSubjectLevel">
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="relation_tbSubjectId">
								<label for="relation_tbSubjectId">TB科目</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="relation_baseSubjectId">
								<label for="relation_baseSubjectId">标准科目</label>
							</div>
						</div>
					</div>
					<div><span style="color:red">  提示：标准科目用于生成标准审计程序</span></div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="relation_reset">
					<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
				</button>
				<button class="btn btn-md btn-primary" type="button" id="relation_save">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="user_tb_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">添加TB科目</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="user_tb_form"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="user_tb_detail2" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">修改TB科目对照</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="user_tb_form2"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="user_subject_detail" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false">
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
					<h3 class="block-title">添加财务科目</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="user_subject_form"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="subject_contract_pre" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false">
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
					<h3 class="block-title">选择对照关系</h3>
				</div>
			</div>
			<div class="modal-body">
					<span style="color: red; ">

				<div style="text-align: left;">
					<p>
						1. 按默认规则：
						<br>①同名对照
						<br>②该客户历史对照规则对照
						<br>③按选择的前推项目对照
					</p>
					<p>
						2. 按其他客户对照规则：
						<br>客户选择框(出现冲突的以所选的客户对照关系为准)
					</p>
				</div>
											</span>

				<label for="detail_customerId">客户名称</label>
				<select class="js-select2 form-control" id="detail_customerId"
						style="width: 100%;">
				</select>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="subject_contract_pre_save">
						<i class="fa fa-save"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1070;">
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
			<div class="modal-body" style="min-height:500px;max-height:500px">
				<div id="adsubject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput2" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_subject_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_subject_sure">
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


<div class="modal fade" id="set_user_direction" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top:40px;z-index: 1070;">

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
					<h3 class="block-title" id="direction_title">选择【】借贷方向</h3>
				</div>
			</div>
			<div class="modal-body">
				<label for="direction_select">借贷方向</label>
				<select class="js-select2 form-control" id="direction_select" style="width: 100%;"></select>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="direction_save">
						<i class="fa fa-save"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>


<!-- <link rel="stylesheet" href="/Faith/dgCenter/js/dg/adjust.css"> -->
<%-- <script src="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.js"></script> --%>
<script src="${pageContext.request.contextPath}/dgCenter/common/adjustDetail.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/tbsubjectContractList.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/tbList.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>