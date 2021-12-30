<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_auditProgramManage">
				<li class="active"><a href="#tab_auditProgramTemplate">部门程序类型模板一览</a></li>
				<%--<li><a href="#tab_auditProgramSubject">部门程序类型标准科目维护</a></li>--%>
				<li><a href="#tab_auditProgramCustomize">部门程序类型模板明细</a></li>
				<li><a href="#tab_auditProgramDetail">审计程序</a></li>
				<li class="pull-right">
                    <ul class="block-options push-10-t push-10-r">
                        <li>
                            <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                        </li>
                    </ul>
                </li>
			</ul>
			<div class="block-content tab-content" id="tab_auditProgramManage_content">
				<div class="tab-pane active" id="tab_auditProgramTemplate">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="auditProgramTemplate_search" type="button">
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
                                                <input class="form-control" type="text" id="auditProgram_ruleName">
												<label for="auditProgram_ruleName">模板名称</label>
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
                                        <button id="auditProgram_add" type="button">
                                            <i class="fa fa-plus" style="color: white;" title="新增模板"></i>
                                        </button>
                                    </li>
                                </ul>
								<h3 class="block-title">模板一览</h3>
							</div>
							<div class="block-content">
								<table id="auditProgramTemplate_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_auditProgramSubject">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="auditProgramSubject_search" type="button">
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
												<label for="auditProgramSubject_templateId">程序类型模板</label>
												<select class="js-select2 form-control" id="auditProgramSubject_templateId"  style="width: 100%;">
													<option></option>
												</select> <label for="auditProgramSubject_templateId">程序类型模板</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="auditProgramSubject_subjectName">标准科目</label>
												<select class="js-select2 form-control" id="auditProgramSubject_subjectName"  style="width: 100%;">
													<option></option>
												</select> <label for="auditProgramSubject_subjectName">标准科目</label>
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
										<button id="auditProgramSubject_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="添加科目"></i>
										</button> 
									</li>
								</ul>
								<h3 class="block-title">报备模板<span id="auditProgramSubject_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="auditProgramSubject_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_auditProgramCustomize">
					<div class="">
					<div class="block block-themed  block-opt-hidden">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="auditProgramCustomize_search" type="button">
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
                                            <label for="auditProgramCustomize_templateId">程序类型模板</label>
                                            <select class="js-select2 form-control" id="auditProgramCustomize_templateId"  style="width: 100%;">
                                                <option></option>
                                            </select> <label for="auditProgramCustomize_templateId">程序类型模板</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-info">
                                    <div class="col-sm-2">
                                        <div class="form-material">
                                            <label for="auditProgramCustomize_subjectName">标准科目</label>
                                            <select class="js-select2 form-control" id="auditProgramCustomize_subjectName"  style="width: 100%;">
                                                <option></option>
                                            </select> <label for="auditProgramCustomize_subjectName">标准科目</label>
                                        </div>
                                    </div>
                                </div>
								<div class="form-group has-info" style="display:none">
									<div class="col-sm-2">
										<div class="form-material">
											<label for="auditProgramCustomize_subjectName">是否添加</label>
											<select class="js-select2 form-control" id="auditProgramCustomize_select"  style="width: 100%;">
												<option></option>
											</select> <label for="auditProgramCustomize_select">是否添加</label>
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
									<button id="auditProgramCustomize_add" type="button">
										<i class="fa fa-plus" style="color: white;" title="添加部门审计程序"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">审计程序一览</h3>
						</div>
						<div class="block-content">
							<table id="auditProgramCustomize_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
				</div>
				<div class="tab-pane" id="tab_auditProgramDetail"></div>
			</div>
		</div>
	</div>
<div class="modal fade" id="modal_addtemplateform" tabindex="-1" role="dialog"
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
				<form class="form-horizontal" id="addtemplate_form"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_selectBaseSubject" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1050;">
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
			<div class="modal-body" style="min-height: 450px; max-height: 450px">
				<div id="subject_tree_base"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-4">
					<input class="form-control" type="text" id="searchInput_tree_base" placeholder="搜索科目">
				</div>
				<div class="col-sm-8">
					<button class="btn btn-md btn-primary" type="button" id="modal_Ttree_base_selectAll">
						<i class="fa fa-check-square-o"></i><span>&nbsp;全选</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_tree_base_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_tree_base_sure">
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
<script src="${pageContext.request.contextPath}/cpBase/js/auditDetailProgram.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/auditProgramManage.js"></script>