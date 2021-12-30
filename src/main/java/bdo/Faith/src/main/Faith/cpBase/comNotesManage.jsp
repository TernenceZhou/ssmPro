<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="comsubjectManageTopTab">
				<li class="active"><a href="#tab_report_subject">报表模板一览</a></li>
				<li><a href="#tab_notes_subject">模板附注维护</a></li>
			</ul>
			<div class="block-content tab-content">
				<div class="tab-pane active" id="tab_report_subject">
					<div class="content">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="report_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_type">模板类型</label>
												<select class="js-select2 form-control" id="template_type"  style="width: 100%;">
													<option></option>
												</select>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_active_flag">状态</label>
												<select class="js-select2 form-control" id="template_active_flag"  style="width: 100%;">
													<option value="1" selected>未作废</option>
													<option value="0">已作废</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="block block-bordered">
							<div class="block-header bg-primary">
								<h3 class="block-title">报表模板一览</h3>
							</div>
							<div class="block-content">
								<table id="report_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_notes_subject">
					<div class="content">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="notes_subject_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="report_templateId">报表模板</label>
												<input class="form-control" type="text" data-result="" data-content="" id="report_templateId" value="">
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
										<button id="notes_sort" type="button" data-name="1">
											<i class="fa fa-list-ol" style="color: white;" title="保存排序"></i>
										</button>
									</li>
									<li>
										<button id="notes_initContrast" type="button" data-name="1">
											<i class="fa fa-indent" style="color: white;" title="初始化对照"></i>
										</button>
									</li>
									<li>
										<button id="notes_init" type="button" data-name="1">
											<i class="si si-cloud-upload" style="color: white;" title="导入模板"></i>
										</button>
									</li>
									<li>
										<button id="notes_plus" type="button" data-name="1">
											<i class="fa fa-plus" style="color: white;" title="新增"></i>
										</button>
									</li>
									<li>
										<!--
										 	设置 bdoexport-btn class
										 	data-bdoexport-table-id: 导出的一览的table id
										 	data-bdoexport-title：导出文件名，一个字符串 或javascript 脚本
										 -->
										<button id="notes_export" type="button" class="bdoexport-btn"
												data-bdoexport-table-id="notes_subject_table"
												data-bdoexport-title="javascript:'附注一览'+$('#template_select').text()">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">附注一览<span id="template_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="notes_subject_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</div>
	<div class="modal fade" id="modal_notesSubForm" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group">
							<div class="col-sm-6">
								<div class="form-material">
									<input class="form-control" type="text" id="notes_autoId" style="display:none">
									<input class="form-control" type="text" id="notes_noteNo" disabled>
									<label for="notes_subjectId">附注编号</label>
								</div>
							</div>
							<div class="col-sm-6 has-success">
								<div class="form-material">
									<input class="form-control" type="text" id="notes_noteName" >
									<label for="notes_subjectName">附注名称<span class="necessary">*</span></label>
								</div>
							</div>
						</div>
						<div class="form-group" id="notes_tpId_group">
                            <div class="col-xs-12 has-success">  
	                            <div class="form-material">                          	
	                            	<label for="notes_tpId">报表模板<span class="necessary">*</span></label>
									<input class="form-control" type="text" data-result="" data-content="" id="notes_tpId" value="">
								</div>
							</div>
                        </div>
						<div class="form-group">
                            <div class="col-xs-12">                            	
	                        	<label for="notes_fileinput">excel模板</label>
                            	<input id="notes_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
            					<div id="errorBlock" class="help-block"></div>
                            </div>
                        </div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="notes_subject_update">
						<i class="fa fa-edit"></i><span>&nbsp;修改</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="notes_subject_add">
						<i class="fa fa-plus"></i><span>&nbsp;新增</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_notesInitForm" tabindex="-1" role="dialog"
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
						<h3 class="block-title">导入模板</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group">
                            <div class="col-xs-12 has-success">  
	                            <div class="form-material">                          	
	                            	<label for="notes_initTp">报表模板<span class="necessary">*</span></label>
									<input class="form-control" type="text" data-result="" data-content="" id="notes_initTp" value="">
								</div>
							</div>
                        </div>
						<div class="form-group">
                            <div class="col-xs-12">                            	
	                        	<label for="notes_fileInit">excel模板</label>
                            	<input id="notes_fileInit" class="file" type="file" multiple data-preview-file-type="any" >
            					<div id="errorBlock" class="help-block"></div>
                            </div>
                        </div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="notes_subject_init">
						<i class="fa fa-plus"></i><span>&nbsp;新增</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<!--  模态框（Modal） -->
	<div class="modal fade" id="colDispModal" style="left: -460px;top: -30px;" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="formulaModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="selColDispBtn" title="确定">
									<i class="fa fa-check"></i>
								</button>
							</li>
							<li>
								<button class="btn btn-primary" type="button" data-dismiss="modal" aria-hidden="true" title="关闭">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h4 class="block-title">报表项</h4>
					</div>
				</div>
				<div class="modal-body" style="height:360px;padding: 0px 20px 5px 20px;">
					<div class="block-content block-content-full" style="padding: 0px;">
						<input type="text" id="notes_subject_autoId" style="display: none;">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group">
								<div class="col-sm-12">
									<div class="form-material">
										<label>报表项</label>
										<select class="js-select2 form-control" id="report_template">
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="row" style="padding-top:15px;">
							<div class="form-group">
								<div class="col-sm-6">
									<div class="form-material">
										<label for="report_colCode">报表项编号</label>
										<input class="form-control" type="text" id="report_colCode" disabled>
									</div>
								</div>
							</div>
						</div>
						<div class="row" style="padding-top:15px;">
							<div class="form-group">
								<div class="col-sm-6">
									<div class="form-material">
										<label for="report_colDisp">报表项表示名</label>
										<input class="form-control" type="text" id="report_colDisp" disabled>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="form-material" id="report_colGroup">
							</div>
						</div>
					</div>
					<div style="float:right;">
						<button type="button" class="btn btn-default" id="uodoColBtn">撤销</button>
						<button type="button" class="btn btn-primary" id="selColBtn">选择</button>
					</div>
				</div>
			</div><!--  /.modal-content -->
		</div><!--  /.modal -->
	</div>
<!-- <iframe id="id_iframe" name="nm_iframe" style="display:none;"></iframe> -->
<script src="${pageContext.request.contextPath}/cpBase/comNotesManage.js"></script>