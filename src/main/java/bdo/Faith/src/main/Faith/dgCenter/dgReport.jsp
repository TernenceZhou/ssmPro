<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div id="dgReportPage">
		<div class="block" style="height: 100%;max-height: 100%;min-height: 100%;margin-bottom: -40px;">
			<div class="block-heade">
				<ul id="navTabUl" class="nav nav-tabs " data-toggle="tabs">
					<li class="active"><a href="#dgReportPageTab">报告</a></li>
				</ul>
			</div>
			<div class="block-content block-content-full" style="height: 93%;max-height: 93%;min-height: 93%;">
				<div id="navTabContent" class="tab-content">
					<div class="tab-pane active" id="dgNotePageTab">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="createReportBtn" type="button">
											<i class="fa fa-send" title="生成报告"> </i>
										</button>
									</li>
									<!-- <li>
										<button id="refershReportBtn" type="button">
											<i class="fa fa-refresh"> 刷新</i>
										</button>
									</li> -->
								</ul>
								<h3 class="block-title">报告一览 <span id="dgReportIndex"></span></h3>
							</div>
							<div class="block-content">
								<table id="dgReportTable"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<input type="text" id="docxPath" style="display: none;">
			<div class="modal fade" id="modal-select" tabindex="-1" role="dialog"
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
								<h3 class="block-title">生成报告</h3>
							</div>
						</div>
						<div class="modal-body" style="padding-bottom: 10px;">
							<div class="row" style="padding: 10px 10px;">
								<label>报告模板：</label>
								<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">
									<input type="radio" name="report_use" data-result="1" checked>
									<span></span>
								</label>&nbsp;曾用报告模板
								<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">
									<input type="radio" name="report_use" data-result="2">
									<span></span>
								</label>&nbsp;上传报告模板
							</div>
							<div class="row" style="padding: 0px 10px;">
								<sapn>曾用模板：</sapn>
								<sapn id="everUsedTemplate"></sapn>
							</div>
						</div>
						<div class="modal-footer">
							<button class="btn btn-md btn-primary" type="button" id="modal_ensure">
								<span>&nbsp;确定</span>
							</button>
							<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
								<span>&nbsp;关闭</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="modal fade" id="uploadTplFormModal" tabindex="-1" role="dialog"
				 aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog" style="margin-top: 150px;">
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
								<h3 class="block-title">上传报告模板</h3>
							</div>
						</div>
						<div class="modal-body">
							<form class="form-horizontal" id="uploadTplForm"></form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/dgReport.js"></script>
