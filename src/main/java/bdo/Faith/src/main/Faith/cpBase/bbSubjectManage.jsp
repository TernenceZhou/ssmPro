<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_bbSubjectManage">
				<li class="active"><a href="#tab_bbTemplate">报备模板一览</a></li>
				<li><a href="#tab_bbMaintain">报备模板维护</a></li>
				<li><a href="#tab_bbReprot">模板对照一览</a></li>
				<li><a href="#tab_bbSubjectManager">报备科目对照</a></li>
				<li class="pull-right">
                    <ul class="block-options push-10-t push-10-r">
                        <li>
                            <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                        </li>
                    </ul>
                </li>
			</ul>
			<div class="block-content tab-content" id="tab_bbSubjectManage_content">
				<div class="tab-pane active" id="tab_bbTemplate">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="bbcomtemplate_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
                                                <input class="form-control" type="text" id="bbsubject_name">
												<label for="bbsubject_name">模板名称</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="bbsubject_remark">
												<label for="bbsubject_remark">描述</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<select class="js-select2 form-control" id="bbsubject_create"  style="width: 100%;">
													<option></option>
												</select>
												<label for="bbsubject_create">创建者</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<select class="js-select2 form-control" id="bbsubject_type"  style="width: 100%;">
													<option></option>
												</select>
												<label for="bbsubject_type">模板类型</label>
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
                                        <button id="bbcomtemplate_add" type="button">
                                            <i class="fa fa-plus" style="color: white;" title="新增模板"></i>
                                        </button>
                                    </li>
                                </ul>
								<h3 class="block-title">模板一览</h3>
							</div>
							<div class="block-content">
								<table id="bbSubjectAll_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_bbMaintain">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="bbMaintain_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="bbTemplate_vocationId">报备模板</label>
												<select class="js-select2 form-control" id="bbTemplate_vocationId"  style="width: 100%;">
													<option></option>
												</select> <label for="bbtemplate_vocationId">报备模板</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="bbTemplate_vocationId">所属报表</label>
												<select class="js-select2 form-control" id="bbTemplate_tableDiv"  style="width: 100%;">
													<option></option>
												</select> <label for="bbTemplate_tableDiv">所属报表</label>
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
										<button id="bb_qy_check" type="button">
											<i class="si si-cloud-upload" style="color: white;" title="报备校验设置"></i>
										</button> 
									</li> 
									<li>
										<button id="bb_export_template" type="button">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button> 
									</li> 
									<li>
										<button id="bb_comtemplate_browse" type="button">
											<i class="fa fa-indent" style="color: white;" title="报表对照"></i>
										</button> 
									</li> 
 									<li>
										<button id="bb_comtemplatecol_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="添加科目"></i>
										</button> 
									</li>
									<li>
										<button id="bb_comtemplate_edit" type="button">
											<i class="fa fa-edit" style="color: white;" title="修改模板"></i>
										</button>
									</li>
									<li>
										<button id="bb_comtemplatecol_sort" type="button">
											<i class="fa fa-list-ol" style="color: white;" title="保存排序"></i>
										</button> 
									</li> 
									<li>
										<button id="bb_import_bbTemplate" type="button">
											<i class="si si-cloud-upload" style="color: white;" title="导入数据"></i>
										</button> 
									</li> 
								</ul>
								<h3 class="block-title">报备模板<span id="bb_template_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="bb_comtemplate_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_bbReprot">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="refreshBbReportBtn" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="tab2_bbTemplate">报备模板</label>
												<select class="js-select2 form-control" id="tab2_bbTemplate"  style="width: 100%;">
													<option></option>
												</select> <label for="tab2_bbTemplate">报备模板</label>
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
										<button id="bb_contract_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="添加对照"> </i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">模板对照</h3>
							</div>
							<div class="block-content">
								<table id="bbReportCompare" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
				
				<div class="tab-pane" id="tab_bbSubjectManager">
					<div class="">
					<div class="block block-themed  block-opt-hidden">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="bbsubject_search" type="button">
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
									<div class="col-sm-3">
										<div class="form-material">
											<select class="js-select2 form-control" id="tab3_bbTemplate"  style="width: 100%;">
													<option></option>
											</select> <label for="tab3_bbTemplate">报备模板</label>
										</div>
									</div>
									<div class="col-sm-2">
										<div class="form-material">
											<label for="bbsubject_rule">报表模板</label>
											<input class="form-control" type="text" data-result="" data-content="" id="bbsubject_rule" value="">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="bb_report_switch" type="button">
										<i class="fa fa-exchange" style="color: white;" title="切换"></i>
									</button>
								</li> -->
								<li>
									<button id="bb_report_contract" type="button">
										<i class="fa fa-repeat" style="color: white;" title="重置对照"></i>
									</button>
								</li>
								<li>
									<button id="bbsubject_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">报备科目一览</h3>
						</div>
						<div class="block-content">
							<table id="bbsubject_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_bbsubform" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
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
				<div class="modal-body">
					<form class="form-horizontal" id="bbsub_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_bbcomtemplateform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">新增模板</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="bbcomtemplate_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comtemplatecolEditform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">修改模板科目</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecolEdit_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_bbcomtemplatecoladdform" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
						<h3 class="block-title">添加报备科目</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="bbcomtemplatecoladd_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_import_bbTemplate" tabindex="-1" role="dialog"
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
						<h3 class="block-title" style="width: 100px;">导入报备科目</h3>
						<h3 class="block-title" id="bbsubjectmanage_ruleName" style="margin-left: 90px; margin-top: -18px;"></h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto;/* overflow: visible;*/">
					<div class="row">
						<div class="form-group">
                        	<label class="col-xs-12" for="bb_template_fileinput">科目数据</label>
                            <div class="col-xs-12">                            	
                            	<input id="bb_template_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
            					<div id="errorBlock" class="help-block"></div>
                            </div>
                        </div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="down_bb_Template">
						<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="import_bb_submit">
						<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>	
	<div class="modal fade" id="init_tamplate_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal" id="export_detail">
									<i class="si si-cloud-download" title="导出"></i>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">详情</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: auto;">
					<div class="row">
						<table id="init_tamplate_table" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
<div class="modal fade" id="modal_bbsubjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:500px;max-height:500px">
				<div id="bbsubject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInputBb" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_bbsubjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_bbsubjectid_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_upload_bbTemplate" tabindex="-1" role="dialog"
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
					<h3 class="block-title" style="width: 120px;">上传报备单模板</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;/* overflow: visible;*/">
				<div class="row">
					<div class="form-group">
                       	<label class="col-xs-12" for="bb_upload_fileinput">报备单模板</label>
                           <div class="col-xs-12">                            	
                           	<input id="bb_upload_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
           					<div id="errorBlock" class="help-block"></div>
                           </div>
                       </div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="upload_bb_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;上传</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>	
<div class="modal fade" id="qy_check_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md" style="width:1000px">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" id="upload_qy_check">
								<i class="si si-cloud-upload" title="导入"></i>
							</button>
						</li>
						<li>
							<button type="button" id="export_qy_check">
								<i class="si si-cloud-download" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">校验公式</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: auto;">
				<div class="row">
					<table id="qy_check_table" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_import_qyCheck" tabindex="-1" role="dialog"
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
					<h3 class="block-title" style="width: 120px;">导入报备校验</h3>
					<h3 class="block-title" id="bbQyCheck_ruleName" style="margin-left: 110px; margin-top: -18px;"></h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;/* overflow: visible;*/">
				<div class="row">
					<div class="form-group">
                       	<label class="col-xs-12" for="bb_qycheck_fileinput">校验数据</label>
                           <div class="col-xs-12">                            	
                           	<input id="bb_qycheck_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
           					<div id="errorBlock" class="help-block"></div>
                           </div>
                       </div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="down_bb_qy">
					<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
				</button>
				<button class="btn btn-md btn-primary" type="button" id="import_bb_qy">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/cpBase/bbTemplate.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/bbSubjectManage.js"></script>