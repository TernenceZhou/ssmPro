<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<!-- <ul class="nav nav-tabs" data-toggle="tabs" id="tab_historyReportCheck">
			<li class="active"><a href="#tab_historyReportCheck1">数据导入(模板)</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul> -->
		<div class="block-content tab-content" id="tab_historyReportCheck_content">
			<div class="tab-pane active">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_historyReportCheck_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<!-- <li>
									<button id="btn_historyReportCheck_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
									</button>
								</li> -->
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
											<select class="js-select2 form-control" id="historyReportCheck_customerId"
													style="width: 100%;">
												<option></option>
											</select> <label for="historyReportCheck_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="historyReportCheck_yyyy" class="form-control date-picker" type="text"
												   value="">
											<label for="historyReportCheck_yyyy">会计年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="js-select2 form-control" id="historyReportCheck_status" style="width: 100%;">
												<option></option>
												<option value="0">上传成功</option>
												<option value="1">审核完成</option>
												<option value="2">计算完成</option>
												<option value="9">处理失败</option>
											</select>
											<label for="historyReportCheck_status">状态</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered" id="historyReportCheck_block">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="historyReportCheck"
								   class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="historyReportCheck-modal" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false" style="top:40px;">
	<div class="modal-dialog modal-md" style="width:600px">
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
					<h3 class="block-title">历史报告</h3>
				</div>
			</div>
			<div class="modal-body" id="historyReportCheck_content"  style="min-height:500px;max-height:500px">
				<div class="tab-pane active" id="tab_unAuditReportser">
					<div class="block-header  bg-primary">
						<ul class="block-options">
							<li>
								<button id="historyReportCheck_export" type="button">
									<i class="si si-cloud-download" style="color: white;" title="导出"></i>
								</button>
							</li>
						</ul>
					</div>
					<div class="tab_temp">
						<div class="block" style="margin: 10px 0 -20px 0">
							<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report_type">
								<li class="active"><a href="#zc_report" data-result="zc_report_table"
													  data-content="1"><i class="fa fa-file-text-o"> 资产负债表</i></a></li>
								<li><a href="#lr_report" data-result="lr_report_table" data-content="3"><i
									class="fa fa-file-text-o"> 利润表</i></a></li>
								<li><a href="#xj_report" data-result="xj_report_table" data-content="4"><i
									class="fa fa-file-text-o"> 现金流量表</i></a></li>
							</ul>
							<div class="block-content tab-content" id="four_report">
								<div class="tab-pane fade in active" id="zc_report" data-result="1">
									<table id="zc_report_table"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
								<div class="tab-pane fade" id="lr_report" data-result="3">
									<table id="lr_report_table"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
								<div class="tab-pane fade" id="xj_report" data-result="4">
									<table id="xj_report_table"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="historyReportCheck_pass">
					<i class="fa fa-send"></i><span>&nbsp;审核并计算</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/historyReportCheck.js"></script>