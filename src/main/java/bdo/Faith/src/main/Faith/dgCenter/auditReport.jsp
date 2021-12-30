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
		min-width: 372px;
		max-width: 372px;
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
<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div class="block">
		<div class="block-heade">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_unAuditReport">
				<%--<li id="tab1" class="active"><a href="#tab_unAuditReportser">审定报表</a></li>--%>
				<li id="tab1" class="active"><a href="#tab_unAuditReportser" data-result="report1_type"
												data-content="1">审定报表</a></li>
				<%--<li id="tab3"><a href="#tab2_unAuditReportser" data-result="report2_type" data-content="2">审定报表-期初</a></li>--%>

				<%--
						<li class="pull-right">
							<ul class="block-options push-10-t push-10-r">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle"></button>
								</li>
							</ul>
						</li>
				--%>
			</ul>


		</div>
		<div class="block-content tab-content" id="tab_unAuditReport_content" style="padding-bottom: 20px">
			<div class="block block-themed" id="tab_head_rpt">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button id="rpt_search" type="button">
								<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
							</button>
						</li>
						<li>
							<button id="rpt_save" type="button">
								<i class="fa fa-save" style="color: white;" title="保存"></i>
							</button>
						</li>
						<li>
							<button id="rpt_check_Report" type="button">
								<i class="fa fa-check" style="color: white;" title="核对完成"></i>
							</button>
						</li>
						<li>
							<button id="audit_report_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button id="audit_report_send" type="button">
								<i class="fa fa-mixcloud" style="color: white;" title="推送至客户门户"></i>
							</button>
						</li>
						<li>
							<button id="audit_report_hidden_check_table" type="button"
									data-toggle="tooltip" title="" data-original-title="校验项"
									style="border: 0px;background-color: #5c90d2">
								<i class="si si-arrow-down" title="校验项"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">
						审定报表 <span id="auditedStateIndex"></span>
					</h3>
					<h3 class="block-title">
						<span id="cus_select"></span>
					</h3>
				</div>
				<div id="rpt_tbcheck_intwrap" style="display: none">
					<table id="rpt_tbcheck" style="margin: 0px 0px 20px 0px"
						   class="table table-bordered table-striped table-hover">
					</table>
				</div>
				
			</div>

			<div class="tab-pane active" id="tab_unAuditReportser">
				<div class="tab_temp">
					<div class="block" style="margin: 10px 0px -20px 0px">
						<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report1_type">
							<li class="active"><a href="#zc_report1" data-result="zc_report1_table" data-content="1"><i
									class="fa fa-file-text-o"> 资产负债表</i></a></li>
							<li><a href="#lr_report1" data-result="lr_report1_table" data-content="3"><i
									class="fa fa-file-text-o"> 利润表</i></a></li>
							<li><a href="#xj_report1" data-result="xj_report1_table" data-content="4"><i
									class="fa fa-file-text-o"> 现金流量表</i></a></li>
							<li><a href="#qy_report1" data-result="qy_report1_table" data-content="5"><i
									class="fa fa-file-text-o">
								所有者权益变动表（本年）
							</i></a></li>
							<li><a href="#lqy_report1" data-result="lqy_report1_table" data-content="6"><i
									class="fa fa-file-text-o">
								所有者权益变动表（上年）
							</i></a></li>
						</ul>
						<div class="block-content tab-content" id="four_report" style="padding-top: 5px;">
							<div class="tab-pane fade in active" id="zc_report1" data-result="1">
								<table id="zc_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="lr_report1" data-result="3">
								<table id="lr_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="xj_report1" data-result="4">
								<table id="xj_report1_table" class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="qy_report1" data-result="5">
								<button name="openXJQYFile" type="button" class="btn btn-xs btn-default push-5-r" title="打开所有者权益变动表">
									<i class="fa fa-file-excel-o">&nbsp;所有者权益变动表底稿.xlsx</i>
								</button>
								<table id="qy_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
							<div class="tab-pane fade" id="lqy_report1" data-result="6">
								<button name="openXJQYFile" type="button" class="btn btn-xs btn-default push-5-r" title="打开所有者权益变动表">
									<i class="fa fa-file-excel-o">&nbsp;所有者权益变动表.xlsx</i>
								</button>
								<table id="lqy_report1_table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab2_unAuditReportser">
				<div class="tab_temp">
					<div class="block" style="margin: 10px 0px -20px 0px">
						<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report2_type">
							<li class="active"><a href="#zc_report2" data-result="zc_report2_table" data-content="1"><i
									class="fa fa-file-text-o"> 资产负债表</i></a></li>
							<li><a href="#lr_report2" data-result="lr_report2_table" data-content="3"><i
									class="fa fa-file-text-o"> 利润表</i></a></li>
							<li><a href="#xj_report2" data-result="xj_report2_table" data-content="4"><i
									class="fa fa-file-text-o"> 现金流量表</i></a></li>
							<li><a href="#qy_report2" data-result="qy_report2_table" data-content="5"><i
									class="fa fa-file-text-o"> 所有者权益变动表</i></a></li>
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

		</div>
	</div>
</div>
<div class="modal fade" id="modal_auditReportSend" tabindex="-1" role="dialog"
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
					<h3 class="block-title">推送至客户门户</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="auditReportSend_title">标题</label>
						<div class="col-xs-12">
							<input id="auditReportSend_title" class="form-control" type="text" value="">
						</div>
					</div>
					<div class="form-group">
						<label class="col-xs-12" for="auditReportSend_remark">备注</label>
						<div class="col-xs-12">
							<input id="auditReportSend_remark" class="form-control" type="text" value="">
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="auditReportSend_submit">
					<i class="fa fa-mixcloud"></i><span>&nbsp;推送</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/auditReport.js"></script>