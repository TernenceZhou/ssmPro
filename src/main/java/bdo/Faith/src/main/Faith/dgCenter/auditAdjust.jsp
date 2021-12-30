<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/dgCenter/common/journalAdjust.jsp" %>
<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs"   style="display: none" id="tab_adjust">
				<li class="active"><a href="#tab_adjustser">审计调整</a></li>
				<li><a href="#tab_noAdjustser">审计未调整</a></li>
				<li><a href="#tab_readjustser">客户调整</a></li>

			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_offset_ul"  style="display: none" >
			<li class="ac"><a href="#tab_offset_adjustser">审计调整</a></li>
			<li><a href="#tab_offset_noAdjustser">审计未调整</a></li>
			<li><a href="#tab_offset">抵消</a></li>
		</ul>

		<div class="block-content tab-content" id="tab_adjust_content">
			<div id="tab_search">
				<div class="content" style="padding: 10px 10px 1px">
					<div class="block block-themed block-opt-hidden">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="btn_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件</h3>
						</div>

						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="search_subjectid">
											<label for="search_subjectid">TB科目</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="search_assItemName">
											<label for="search_assItemName">辅助核算</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="search_yyyy" class="form-control date-picker" type="text"
												   autocomplete="off">
											<label for="search_yyyy">调整年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="search_fillUser">
											<label for="search_fillUser">制单人</label>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
			<div class="tab-pane active" id="tab_adjustser">
				<div class="content" style="padding: 10px 10px 1px">
					<!-- <div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="adjust_search" type="button">
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
											<select class="js-select2 form-control" id="adjust_companyid"  style="width: 100%;">
												<option></option>
											</select>
											<label for="adjust_companyid">客户名称</label>
											<input class="form-control" type="text" id="adjust_companyid" disabled>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-1">
										<div class="form-material">
											<select class="form-control" id="adjust_year">
												<option></option>
											</select> <label for="adjust_year">账套年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="adjust_subjectid">
											<label for="adjust_subjectid">科目编号</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					 -->
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="adjust_plus" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
									</button>
								</li> -->
								<li>
									<button id="adjust_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="adjust_importAudit" data-adjustType="2" type="button">
										<i class="si si-cloud-upload" style="color: white;" title="导入数据"></i>
									</button>
								</li>
								<li>
									<button class="bdoexport-btn" type="button" data-bdoexport-table-id="adjust_table"
											data-bdoexport-title="审计调整分录表">
										<i class="si si-cloud-download" title="导出"></i>
									</button>
									<%--<button id="adjust_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>--%>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title"><span id="cus_select1"></span></h3>
						</div>
						<div class="block-content">
							<table id="adjust_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_noAdjustser">
				<div class="content" style="padding: 10px 10px 1px">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="noAdjust_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button class="bdoexport-btn" type="button" data-bdoexport-table-id="noAdjust_table"
											data-bdoexport-title="审计调整分录表">
										<i class="si si-cloud-download" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title"><span id="cus_select3"></span></h3>
						</div>
						<div class="block-content">
							<table id="noAdjust_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_readjustser">
				<div class="content" style="padding: 10px 10px 1px">
					<!-- <div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="readjust_search" type="button">
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
											<select class="js-select2 form-control" id="readjust_companyid"  style="width: 100%;">
												<option></option>
											</select>
											<input class="form-control" type="text" id="readjust_companyid" disabled>
											<label for="readjust_companyid">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-1">
										<div class="form-material">
											<select class="form-control" id="readjust_year">
												<option></option>
											</select> <label for="readjust_year">账套年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="readjust_subjectid">
											<label for="readjust_subjectid">科目编号</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info" style="display:none;">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="readjust_vocationId">
												<option></option>
											</select> <label for="readjust_vocationId">报表模板</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					 -->
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="readjust_plus" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
									</button>
								</li> -->
								<li>
									<button id="readjust_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="adjust_importUser" data-adjustType="1" type="button">
										<i class="si si-cloud-upload" style="color: white;" title="导入数据"></i>
									</button>
								</li>
								<li>
									<button class="bdoexport-btn" type="button" data-bdoexport-table-id="readjust_table"
											data-bdoexport-title="客户调整分录表">
										<i class="si si-cloud-download" title="导出"></i>
									</button>
									<%--<button id="readjust_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>--%>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title"><span id="cus_select2"></span></h3>
						</div>
						<div class="block-content">
							<table id="readjust_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>

			<div class="tab-pane" id="tab_offset">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="readjust_plus" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
									</button>
								</li> -->
								<li>
									<button id="offset_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
									        data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">分录一览<span id=""></span></h3>
						</div>
						<div class="block-content">
							<table id="offset_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_offset_adjustser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="readjust_plus" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
									</button>
								</li> -->
								<li>
									<button id="offset_adjustser_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
									        data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">分录一览<span></span></h3>
						</div>
						<div class="block-content">
							<table id="offset_adjustser_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_offset_noAdjustser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="readjust_plus" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
									</button>
								</li> -->
								<li>
									<button id="offset_noAdjustser_search" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
									        data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">分录一览<span></span></h3>
						</div>
						<div class="block-content">
							<table id="offset_noAdjustser_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
</div>
<div id="sideRegin"></div>
<div class="modal fade" id="modal-importCustomerReport" tabindex="-1" role="dialog"
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
					<h3 class="block-title">导入客户数据</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<!-- <div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="import_customer" style="width: 100%;">
									<option></option>
								</select>
								<input class="form-control" type="text" id="import_customer" disabled>
								<label for="import_customer">客户名称</label>
							</div>
						</div>
					</div> -->
					<div class="form-group">
						<label class="col-xs-12"
							   for="selectProjectYear"
							   style="width:15%;">选择年份:</label>
						<div class="form-material col-xs-8 col-sm-8 col-lg-8"
							 style="margin: 0px; width:30%;margin-top: -7px;">
							<select class="form-control" id="selectProjectYear" name="filter"
									size="1">
							</select>
						</div>
						<div class="col-xs-12">
							<input id="fileinput" class="file" type="file" multiple data-preview-file-type="any">
							<div id="errorBlock" class="help-block"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="import_dlTemplate">
					<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
				</button>
				<button class="btn btn-md btn-primary" type="button" id="import_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-autocomplete/jquery.autocomplete.min.js"></script>
<style>
	.autocomplete-suggestions { border: 1px solid #999; background: #FFF; overflow: auto; }
	.autocomplete-suggestion { padding: 2px 5px; white-space: nowrap; overflow: hidden; }
	.autocomplete-selected { background: #5dbef0; }
	.autocomplete-suggestions strong { font-weight: normal; color: #3399FF; }
</style>

<link rel="stylesheet" href="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.css">
<%-- <script src="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.js"></script> --%>
<script src="${pageContext.request.contextPath}/dgCenter/auditAdjust.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/adjustSummery.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/DG_CONST_STATE.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/adjustDetail.js"></script>