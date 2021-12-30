<style>
	.block-opt-refresh-i {
		opacity: .25;
		color: rgb(100, 100, 100);
		position: absolute;
	}
</style>
<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/dgCenter/common/journalAdjust.jsp" %>
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
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_unAuditReport">
			<li id="tab1" class="active"><a href="#tab_unAuditReportser">审定报表</a></li>
			<li id="tab2"><a href="#tab_adjustGather">调整汇总</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option"
								data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_unAuditReport_content">
			<div class="tab-pane active" id="tab_unAuditReportser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="rpt_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="rpt_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
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
											<!-- <select class="js-select2 form-control" id="rpt_customerId">
													<option></option>
												</select>  -->
											<input class="form-control" type="text" id="rpt_customerId"
												   disabled> <label for="rpt_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material input-group">
											<select class="form-control" id="rpt_startYear">
												<option></option>
											</select> <span id="search_dateAddon" class="input-group-addon">-</span>
											<select class="form-control" id="rpt_endYear">
												<option></option>
											</select> <label for="rpt_startYear">账套期间</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="rpt_showZero">
												<option value='0'>是</option>
												<option value='1'>否</option>
											</select> <label for="rpt_showZero">显示金额不为0</label>
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
									<button id="rpt_check_Report" type="button">
										<i class="fa fa-line-chart" style="color: white;" title="核对完成"></i>
									</button>
								</li>
								<li>
									<button id="rpt_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								未审报表<span id="cus_select"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="rpt_tab"
								   class="table table-bordered table-striped table-hover">
								<tfoot></tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_adjustGather">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="refreshAdjustTableBtn" type="button">
									<i class="fa fa-refresh"> 刷新</i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">客户调整汇总</h3>
					</div>
					<div class="block-content">
						<div class="row">
							<table id="adjustTable" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal-importCustomerReport" tabindex="-1"
	 role="dialog" aria-hidden="true" data-backdrop="static"
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
					<h3 class="block-title">导入客户数据</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<!--<select class="js-select2 form-control" id="import_customer" style="width: 100%;">
										<option></option>
									</select>   -->
								<input class="form-control" type="text" id="import_customer"
									   disabled> <label for="import_customer">客户名称</label>
							</div>
						</div>
					</div>
					<!-- <div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="import_year">
										<option></option>
									</select>
									<label for="import_year">账套年度</label>		
								</div>
							</div>
							
						</div> -->
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material input-group">
								<select class="form-control" id="import_startYear">
									<option></option>
								</select> <span id="search_dateAddon" class="input-group-addon">-</span>
								<select class="form-control" id="import_endYear">
									<option></option>
								</select> <label for="import_startYear">账套期间</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="form-control" id="import_vocationId">
									<option></option>
								</select><label for="import_vocationId">报表模板</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<label class="col-xs-12" for="fileinput">客户数据</label>
						<div class="col-xs-12">
							<input id="fileinput" class="file" type="file" multiple
								   data-preview-file-type="any">
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
<script src="${pageContext.request.contextPath}/dgCenter/unAuditReport.js"></script>
