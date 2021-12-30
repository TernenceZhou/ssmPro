<style>
	.block-opt-refresh-i {
		opacity: .25;
		color: rgb(100, 100, 100);
		position: absolute;
	}

	.tab_temp > .block > .nav-tabs > li.active > a,
	.tab_temp > .block > .nav-tabs > li.active > a:hover,
	.tab_temp > .block > .nav-tabs > li.active > a:focus {
		color: black;
		background-color: white;
	}

	.width-jyx  {
		min-width: 370px;
		max-width: 370px;
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
	.width-calfun  {
		min-width: 260px;
		max-width: 260px;
		word-wrap: break-word;
	}
</style>
<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/dgCenter/common/journalAdjust.jsp" %>
<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div class="block">
		<div class="block-heade">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_unAuditReport">
				<li id="tab1" class="active"><a href="#tab_unAuditReportser" data-result="report1_type"
												data-content="1">未审报表-期末/本期</a></li>
				<li id="tab3"><a href="#tab2_unAuditReportser" data-result="report2_type"
								 data-content="2">未审报表-期初/上期</a>
				</li>
				<li id="abs-remain">
					<a href="#tab2_unAuditReportser" data-result="report2_type" data-content="2">客户报表</a>
				</li>
				<li id="tab2"><a href="#tab_adjustGather">客户调整汇总</a></li>
				<!-- <li class="pull-right">
					<ul class="block-options push-10-t push-10-r">
						<li>
							<button type="button" data-toggle="block-option"
									data-action="fullscreen_toggle"></button>
						</li>
					</ul>
				</li> -->
			</ul>
		</div>
		<div class="block-content tab-content" id="tab_unAuditReport_content" style="padding-bottom: 20px">
			<div class="block block-themed" id="tab_head_rpt">
				<div class="block-header bg-primary">
					<div style="height:18px;">
						<h3 class="block-title" style="float:left;">
							未审报表 <span id="unReportIndex"></span>
						</h3>
						<ul class="block-options">
							<li >
								<div class="block-options form-group has-info" style="float: left;">
									<label class="col-xs-4 col-sm-4 col-lg-4 control-label" for="report_editer"
									       style="text-align: right;padding-top:4px;color: #fff;width: 100px;">报表编制人:</label>
									<div class="form-material col-xs-8 col-sm-8 col-lg-8" style="margin: 0;width: 110px">
										<select class="form-control" value="2" id="report_editer" name="filter" size="1"
										        style="color: #fff;padding:0px;">
										</select>
									</div>
								</div>
								<div class="block-options form-group has-info" style="float: left;">
<%--									<label class="col-xs-5 col-sm-5 col-lg-5 control-label" for=""--%>
<%--										   style="text-align: right;padding-top:4px;color: white;">显示方式:</label>--%>
									<div class="form-material col-xs-7 col-sm-7 col-lg-7" style="width: 140px;
									margin: 0;padding-right: 0;padding-left: 0;">
										<select class="form-control" id="rpt_showZero" name="filter" size="1"
												style="color: white;padding:0px;">
											<option value="2" style="color: #000;" selected>全部</option>
											<option value="0" style="color: #000;">总账或调整金额不为0</option>
											<option value="1" style="color: #000;">总账和调整金额为0</option>
										</select>
									</div>
								</div>
							</li>
							<li>
								<button id="rpt_search" type="button">
									<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
								</button>
							</li>
							<li>
								<button id="rpt_check_Report" type="button">
									<i class="fa fa-check" style="color: white;" title="核对完成"></i>
								</button>
							</li>
							<li>
								<button id="rpt_createReport" type="button">
									<i class="fa fa-bar-chart" style="color: white;" title="生成未审报表"></i>
								</button>
							</li>
							<li>
								<button id="rpt_save" type="button">
									<i class="fa fa-save" style="color: white;" title="保存"></i>
								</button>
							</li>
							<li>
								<button id="rpt_importCustomerReport" type="button">
									<i class="si si-cloud-upload" style="color: white;" title="导入客户报表"></i>
								</button>
							</li>

							<li>
								<button id="rpt_adjustReport" type="button">
									<i class="fa fa-balance-scale" style="color: white;" title="客户调整"></i>
								</button>
							</li>
							<li>
								<button id="rpt_export" type="button">
									<i class="si si-cloud-download" style="color: white;" title="导出"></i>
								</button>
							</li>
							<li>
	                            <button id="unAudit_report_hidden_check_table" type="button"
	                                    data-toggle="tooltip" title="" data-original-title="校验项"
	                                    style="border: 0px;background-color: #5c90d2">
	                                <i class="si si-arrow-down" title="校验项"></i>
	                            </button>
	                        </li>
							<!-- <li>
                                <button type="button" data-toggle="block-option"
                                        data-action="fullscreen_toggle" style="color: white;">
                                </button>
                            </li> -->
						</ul>
					</div>
				</div>
				<%--<div class="block-header" style="float: left;margin-left: -50px; margin-top: 5px;">

				</div>--%>
				<div id="unAudit_rpt_tbcheck_intwrap" style="display: none">
				    <table id="rpt_tbcheck" style="margin: 0px 0px 20px 0px;"
                       class="table table-bordered table-striped table-hover">
                    </table>
				</div>
			</div>
			<div class="tab-pane active" id="tab_unAuditReportser">
				<div class="tab_temp">
					<div class="block" style="margin: 10px 0px -20px 0px">
						<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report1_type">
							<li class="active"><a href="#zc_report1" data-result="zc_report1_table"
												  data-content="1"><i class="fa fa-file-text-o"> 资产负债表</i></a></li>
							<li><a href="#lr_report1" data-result="lr_report1_table" data-content="3"><i
									class="fa fa-file-text-o"> 利润表</i></a></li>
							<%--<li><a href="#xj_report1" data-result="xj_report1_table" data-content="4"><i
									class="fa fa-file-text-o"> 现金流量表</i></a></li>
							<li><a href="#qy_report1" data-result="qy_report1_table" data-content="5"><i
									class="fa fa-file-text-o"> 所有者权益变动表</i></a></li>--%>
						</ul>
						<div class="block-content tab-content" id="four_report">
							<div class="tab-pane fade in active" id="zc_report1" data-result="1">
								<table id="zc_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="lr_report1" data-result="3">
								<table id="lr_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="xj_report1" data-result="4">
								<table id="xj_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
<%--							<div class="tab-pane fade" id="qy_report1" data-result="5">
								<table id="qy_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>--%>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab2_unAuditReportser">
				<div class="tab_temp">
					<div class="block" style="margin: 10px 0px -20px 0px">
						<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report2_type">
							<li class="active"><a href="#zc_report2" data-result="zc_report2_table"
												  data-content="1"><i class="fa fa-file-text-o"> 资产负债表</i></a></li>
							<li><a href="#lr_report2" data-result="lr_report2_table" data-content="3"><i
									class="fa fa-file-text-o"> 利润表</i></a></li>
	<%--						<li><a href="#xj_report2" data-result="xj_report2_table" data-content="4"><i
									class="fa fa-file-text-o"> 现金流量表</i></a></li>
							<li><a href="#qy_report2" data-result="qy_report2_table" data-content="5"><i
									class="fa fa-file-text-o"> 所有者权益变动表</i></a></li>--%>
						</ul>
						<div class="block-content tab-content" id="four_report2">
							<div class="tab-pane fade in active" id="zc_report2" data-result="1">
								<table id="zc_report2_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="lr_report2" data-result="3">
								<table id="lr_report2_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="xj_report2" data-result="4">
								<table id="xj_report2_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="qy_report2" data-result="5">
								<table id="qy_report2_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_adjustGather">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<div class="block-options form-group has-info"
									 style="width: 260px; float: left;">
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
								<%--								<button id="exportAdjustTableBtn" type="button">
                                                                    <i class="si si-cloud-download" title="导出"></i>
                                                                </button>  --%>
								<button class="bdoexport-btn" type="button" data-bdoexport-table-id="adjustTable"
										data-bdoexport-title="客户调整分录表">
									<i class="si si-cloud-download" title="导出"></i>
								</button>
							</li>
							<li>
								<button id="refreshAdjustTableBtn" type="button">
									<i class="fa fa-refresh" title="刷新"> </i>
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
<link rel="stylesheet" href="/Faith/dgCenter/js/dg/adjust.css">
<script src="${pageContext.request.contextPath}/dgCenter/unAuditReport.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/DG_CONST_STATE.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/adjustDetail.js"></script>