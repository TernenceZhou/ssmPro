<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
 	<!--<div class="content bg-gray-lighter">
		<div class="row items-push">
			<div class="col-sm-7">
				<h1 id="page_head" class="page-heading"></h1>
			</div>
			<div class="col-sm-5 text-right hidden-xs">
				<ol id="page_title" class="breadcrumb push-10-t">
				</ol>
			</div>
		</div>
	</div>   -->
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_cuSubjectManage">
				<li class="active"><a href="#tab_cuSubjectManager">客户TB科目维护</a></li>
				<li class="pull-right">
                    <ul class="block-options push-10-t push-10-r">
                        <li>
                            <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                        </li>
                    </ul>
                </li>
			</ul>
			<div class="block-content tab-content" id="tab_cuSubjectManage_content">
				<div class="tab-pane active" id="tab_cuSubjectManager">
					<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="cusubject_search" type="button">
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
									<div class="col-sm-4">
										<div class="form-material">
											<!-- <select class="js-select2 form-control" id="cusubject_cu"  style="width: 100%;" disabled>
												<option></option>
											</select>  -->
											<input class="form-control" type="text" id="cusubject_cu" disabled>
											<label for="cusubject_cu">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-1">
										<div class="form-material">
											<input class="form-control" type="text" id="cusubject_id">
											<label for="cusubject_id">底稿索引编号</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="cusubject_name">
											<label for="cusubject_name">科目名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="js-select2 form-control" id="cusubject_rule"  style="width: 100%;">
													<option></option>
											</select> <label for="cusubject_rule">报表模板</label>
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
									<button id="rpt_importCustomerReport" type="button">
											<i class="si si-cloud-upload" style="color: white;" title="导入客户报表"></i>
									</button>
								</li>
								<li>
									<button id="cusubject_init" type="button">
										<i class="si si-cloud-upload" style="color: white;" title="导入部门标准科目"></i>
									</button>
								</li>
								<li>
									<button id="cusubject_sort" type="button">
										<i class="fa fa-list-ol" style="color: white;" title="保存排序"></i>
									</button>
								</li>
								<li>
									<button id="cusubject_plus" type="button">
										<i class="fa fa-plus" style="color: white;" title="新增"></i>
									</button>
								</li>
								<li>
									<button id="cusubject_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">客户TB科目一览</h3>
						</div>
						<div class="block-content">
							<table id="cusubject_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
				
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modal_cusubform" tabindex="-1" role="dialog"
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
					<form class="form-horizontal" id="cusub_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal-importCustomerReport" tabindex="-1" role="dialog"
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
						<h3 class="block-title">导入客户数据</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						
						
						
						
						<div class="form-group">
                        	<label class="col-xs-12" for="fileinput">客户数据</label>
                            <div class="col-xs-12">                            	
                            	<input id="fileinput" class="file" type="file" multiple data-preview-file-type="any" >
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
<script src="${pageContext.request.contextPath}/cpBase/customerTBManage.js"></script>