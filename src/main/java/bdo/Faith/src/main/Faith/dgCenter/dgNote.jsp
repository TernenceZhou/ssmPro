<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div id="dgNotePage" style="height: 100%;">
		<div class="block" style="height: 100%;margin-bottom: -40px;">
			<div class="block-heade">
				<ul id="navTabUl" class="nav nav-tabs " data-toggle="tabs">
					<li class="active"><a href="#dgNotePageTab">附注</a></li>
				</ul>
			</div>
			<div class="block-content block-content-full" style="height: 94%;padding: 0px 20px 0px 20px;">
				<div id="navTabContent" class="tab-content" style="height: 100%;">
					<div class="tab-pane active" id="dgNotePageTab" style="height: 100%;">
						<div class="block block-themed" style="margin-bottom: 10px;">
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
										<button id="toggleBtn" type="button" data-toggle="block-option" data-action="content_toggle">
											<i class="si si-arrow-up" style="color: white;"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">查询条件设定</h3>
							</div>
							<div id="search-condition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<input class="form-control" type="text" id="note_noteName" style="width: 100%;">
												<label for="note_noteName">附注名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="note_colName" style="width: 100%;">
												<label for="note_colName">报表科目</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="note_isForbid" style="width: 100%;">
													<option value=""></option>
													<option value="0">否</option>
													<option value="1">是</option>
												</select>
												<label for="note_isForbid">已禁用</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="note_isEdited" style="width: 100%;">
													<option value=""></option>
													<option value="0">否</option>
													<option value="1">是</option>
												</select>
												<label for="note_isEdited">已编辑</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="note_isFinished" style="width: 100%;">
													<option value=""></option>
													<option value="0">否</option>
													<option value="1">是</option>
												</select>
												<label for="note_isFinished">已完成</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="note_checkResult" style="width: 100%;">
													<option value=""></option>
													<option value="1">正确</option>
													<option value="0">错误</option>
												</select>
												<label for="note_checkResult">校验结果</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="block block-themed" style="margin-bottom: 0px;">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="refreshBtn" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
									<li>
										<button id="downloadAllNoteBtn" type="button">
											<i class="fa fa-download" title="批量下载附注"></i>
										</button>
									</li>
									<li>
										<button id="uploadAllNoteBtn" type="button">
											<i class="fa fa-upload" title="批量上传附注"></i>
										</button>
									</li>
									<li>
										<button id="initNodeBtn" type="button">
											<i class="fa fa-power-off red-light" title="初始化附注"></i>
										</button>
									</li>
									<li>
										<button id="exportNodeBtn" type="button">
											<i class="si si-cloud-download" title="导出附注一览"> </i>
										</button>
									</li>
									<li>
										<button id="addNodeBtn" type="button">
											<i class="fa fa-plus" title="添加附注"> </i>
										</button>
									</li>
									<li>
										<button id="finishBatchBtn" type="button">
											<i class="si si-settings" title="批量设置已完成"> </i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">附注一览 <span id="remarkIndex"></span>
								</h3>
							</div>
							<div class="block-content">
								<table id="dgNoteTable" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="dgNoteEditModal" class="modal fade" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 50px;">
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
							<h3 class="block-title" id="editPageTitle"></h3>
						</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="dgNoteEditForm"></form>
					</div>
				</div>
			</div>
		</div>
		<div id="dgNoteUploadModal" class="modal fade" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 50px;">
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
							<h3 class="block-title">上传模板</h3>
						</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="dgNoteUploadFiltForm"></form>
					</div>
				</div>
			</div>
		</div>
		<div id="dgNoteUploadAllModal" class="modal fade" tabindex="-1" role="dialog"
				aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 50px;">
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
							<h3 class="block-title">批量上传附注</h3>
						</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="dgNoteUploadAllFileForm"></form>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="batchUpdateNoteFinishedModal" tabindex="-1" role="dialog"aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 150px;">
				<div class="modal-content" style="width: 100%">
					<div class="block block-themed block-transparent remove-margin-b">
						<div class="block-header bg-info">
							<ul class="block-options">
								<li>
									<button type="button" id="checkFinishedBtn"><i class="fa fa-check">确定</i></button>
								</li>
								<li>
									<button type="button" data-dismiss="modal">
										<i class="si si-close"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">批量设置已完成</h3>
						</div>
					</div>
					<div class="modal-body">
						<table id="batchUpdateNoteFinishedTable" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/dgNote.js"></script>
