<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="reportManageTopTab">
				<li class="active"><a href="#tab_report">生成报告</a></li>
			</ul>
			<div class="block-content tab-content">
				<div class="tab-pane active" id="tab_report">
					<div class="content">
						<div class="block block-bordered">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="report_refresh" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报告</h3>
							</div>
							<div class="block-content">
								<table id="report_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal fade" id="modal_report" tabindex="-1" role="dialog"
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
								<h3 class="block-title">报告</h3>
							</div>
						</div>
						<div class="modal-body" style="height: auto; overflow: visible;">
							<div class="row" style="margin-top: 15px;">
								<div class="form-group">
									<div class="col-sm-12 has-success">
										<div class="form-material">
											<input class="form-control" type="text" id="report_autoId" style="display:none">
											<input class="form-control" type="text" id="report_reportTplID" style="display:none">
											<label for="report_rootpath">根目录<span class="necessary">*</span></label>
											<input class="form-control" type="text" id="report_rootPath">
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="margin-top: 15px;">
								<div class="form-group">
									<div class="col-sm-12 has-success">
										<div class="form-material">
											<label for="report_reportPath">报告文件路径<span class="necessary">*</span></label>
											<input class="form-control" type="text" id="report_reportPath">
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="margin-top: 15px;">
								<div class="form-group">
									<div class="col-sm-12 has-success">
										<div class="form-material">
											<label for="report_configPath">报告配置文件路径<span class="necessary">*</span></label>
											<input class="form-control" type="text" id="report_configPath">
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="margin-top: 15px;">
								<div class="form-group">
									<div class="col-sm-12 has-success">  
										<div class="form-material">
											<label for="report_deleteConfigPath">删除条件配置文件路径<span class="necessary">*</span></label>
											<input class="form-control" type="text" id="report_deleteConfigPath">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
								<span>&nbsp;关闭</span>
							</button>
							<button class="btn btn-md btn-primary" type="button" id="report_save">
								<span>&nbsp;保存</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<script src="${pageContext.request.contextPath}/cpBase/reportManage.js"></script>