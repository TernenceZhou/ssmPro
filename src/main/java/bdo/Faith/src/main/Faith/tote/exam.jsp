<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_exam">
			<li class="active"><a href="#tab_exam_list">考试任务一览</a></li>
			<li class=""><a id="exam_detail_a" href="#tab_exam_detail">考试详情</a></li>
		</ul>
		<div class="block-content tab-content">
			<div class="tab-pane active" id="tab_exam_list">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_exam_search" type="button">
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
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="exam_name">
											<label for="exam_name">考试名称</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button id="exam_add" type="button">
										<i class="fa fa-plus" style="color: white;" title="添加考试"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果</h3>

						</div>
						<div class="block-content" id="chartsBenford">
							<table id="examTable"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_exam_detail">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_exam_detail_search" type="button">
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
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="exam_detail_name" disabled="true">
											<label for="exam_detail_name">考试名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="subject_detail_name">
											<label for="subject_detail_name">科目名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="user_detail_name">
											<label for="user_detail_name">考生名</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="js-select2 form-control" id="exam_detail_status"
													style="width: 100%;">
												<option></option>
											</select> <label for="exam_detail_status">考试状态</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="js-select2 form-control" id="audit_detail_status"
													style="width: 100%;">
												<option></option>
											</select> <label for="audit_detail_status">审核状态</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果</h3>

						</div>
						<div class="block-content">
							<table id="examDetailTable"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_addExm" tabindex="-1" role="dialog"
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
					<h3 class="block-title">创建考试</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<div class="col-xs-12">
							<div class="form-material">
								<input id="exam_name_modal" class="form-control" type="text">
								<label for="exam_name_modal">考试名称</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-xs-12">
							<div class="form-material input-group">
								<input id="exam_endDate_modal" class="form-control date-picker" size=10
									type="text" step="01" value="" autocomplete="off">
								<span class="input-group-addon">-</span>
								<input id="exam_endTime_modal" class="form-control" size=10
									type="time" step="01" value="" autocomplete="off">
								<label for="exam_date_modal">考试结束时间</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="exam_save">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_copyExm" tabindex="-1" role="dialog"
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
					<h3 class="block-title">复制考试</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<div class="col-xs-12">
							<div class="form-material">
								<input id="exam_name_copy" class="form-control" type="text">
								<label for="exam_name_copy">考试名称</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="exam_copy">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_examEdit" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg" style="width:1200px">
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
					<h3 class="block-title">编辑</h3>
				</div>
			</div>
			<div class="modal-body" style="max-height:550px;">
				<div class="block block-themed">
					<div class="block-search">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group">
								<div class="col-sm-6">
									<div class="form-material">
										<input class="form-control" type="text" id="exam_name_update">
										<label for="exam_name_update">考试名称</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-6">
									<div class="form-material input-group">
										<input id="exam_endDate_update" class="form-control date-picker" size=10
											   type="text" value="" autocomplete="off">
										<span class="input-group-addon">-</span>
										<input id="exam_endTime_update" class="form-control" size=10
											   type="time" step="01" autocomplete="off">
										<label for="exam_endDate_update">考试结束时间</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="exam_user_add" type="button">
									<i class="fa fa-plus" style="color: white;" title="添加员工"></i>
								</button>
							</li>
							<li>
								<button type="button" id="exam_user_upload">
									<i class="si si-cloud-upload" title="导入"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">考试人员</h3>

					</div>
					<div class="block-content">
						<table id="examUserTable"
							   class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="exam_audit_add" type="button">
									<i class="fa fa-plus" style="color: white;" title="添加审核人"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">审核人员</h3>
					</div>
					<div class="block-content">
						<table id="examAuditTable"
							   class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>	
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="exam_subject_add" type="button">
									<i class="fa fa-plus" style="color: white;" title="添加科目"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">考试科目</h3>
					</div>
					<div class="block-content">
						<table id="examSubjectTable"
							   class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>	
			</div>
			<div class="modal-footer">
				<div class="col-sm-12">
					<button class="btn btn-md btn-primary" type="button" id="exam_edit_save">
						<i class="fa fa-save"></i><span>&nbsp;保存</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_upload_examSubject" tabindex="-1" role="dialog"
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
					<h3 class="block-title" style="width: 120px;">添加科目</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;/* overflow: visible;*/">
				<div class="row">
					<div class="form-group">
                    	<label class="col-xs-12" for="subject_modal_add">科目</label>
                        <div class="col-xs-12">                            	
                        	<input id="subject_modal_add" class="form-control" type="text" value="">
                        </div>
                    </div>
				</div>
				<div class="row">
					<div class="form-group">
                    	<label class="col-xs-12" for="upload_fileinput_modal">底稿文件</label>
                        <div class="col-xs-12">                            	
                        	<input id="upload_fileinput_modal" class="file" type="file" multiple data-preview-file-type="any" >
        					<div id="errorBlock" class="help-block"></div>
                        </div>
                    </div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="subjec_upload_modal">
					<i class="si si-cloud-upload"></i><span>&nbsp;上传</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_selectUser" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg" style="width:800px">
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
					<h3 class="block-title">人员选择</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:500px">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="btn_user_search" type="button">
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
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="user_name">
										<label for="user_name">人员姓名</label>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
                                <div class="col-sm-4">
                                    <div class="form-material">
                                        <input class="form-control" type="text" id="roleuser_depart">
                                        <label for="roleuser_depart">所属部门</label>
                                    </div>
                                </div>
                            </div>
						</div>
					</div>
				</div>
				<div class="block block-bordered">
					<div class="block-header  bg-primary">
						<!-- <ul class="block-options">
							<li>
								<button id="exam_add" type="button">
									<i class="fa fa-plus" style="color: white;" title="添加考试"></i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
								</button>
							</li>
						</ul> -->
						<h3 class="block-title">查询结果</h3>
					</div>
					<div class="block-content">
						<table id="userTable"
							   class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_upload_examUser" tabindex="-1" role="dialog"
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
					<h3 class="block-title" style="width: 120px;">导入考生</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;/* overflow: visible;*/">
				<div class="row">
					<div class="form-group">
                    	<label class="col-xs-12" for="upload_exam_user_modal">考生名单</label>
                        <div class="col-xs-12">                            	
                        	<input id="upload_exam_user_modal" class="file" type="file" multiple data-preview-file-type="any" >
        					<div id="errorBlock_exam_user" class="help-block"></div>
                        </div>
                    </div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="user_upload_modal">
					<i class="si si-cloud-upload"></i><span>&nbsp;上传</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_examUser_list" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg" style="width:1000px">
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
					<h3 class="block-title" style="width: 120px;">考生名单</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;/* overflow: visible;*/">
				<div class="block-content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_examUser_search" type="button">
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
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="examUser_name">
											<label for="examUser_name">考生名</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<select class="js-select2 form-control" id="examUser_status"
													style="width: 100%;">
												<option></option>
											</select> <label for="examUser_status">考试状态</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<table id="examUserListTable"
						   class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/tote/exam.js"></script>