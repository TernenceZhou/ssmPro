<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content bg-gray-lighter">
		<div class="row items-push">
			<div class="col-sm-7">
				<h1 id="page_head" class="page-heading"></h1>
			</div>
			<div class="col-sm-5 text-right hidden-xs">
				<ol id="page_title" class="breadcrumb push-10-t">
				</ol>
			</div>
		</div>
	</div>
	<div class="content">
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
<!-- 					<li> -->
<!-- 						<button id="btn_departadd" type="button"> -->
<!-- 							<i class="fa fa-plus">&nbsp;新增单位</i> -->
<!-- 						</button> -->
<!-- 					</li> -->
					<li>
						<button id="btn_refresh" type="button">
							<i class="fa fa-repeat">&nbsp;刷新</i>
						</button>
					</li>
					<li>
						<button id="btn_managerview" type="button">
							<i class="fa fa-eye">&nbsp;部门负责人一览查阅</i>
						</button>
					</li>
<!-- 					<li> -->
<!-- 						<button id="btn_departsynchro" type="button"> -->
<!-- 							<i class="fa fa-download">&nbsp;同步</i> -->
<!-- 						</button> -->
<!-- 					</li> -->
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">部门</h3>
			</div>
			<div class="block-content">
				<table id="department_tree">
				</table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_departadd" tabindex="-1" role="dialog"
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
						<h3 class="block-title">新增单位</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<form class="form-horizontal" id="form_departadd"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_departmanager" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-primary-dark">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">部门负责人</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="manager_search" type="button">
										<i class="fa fa-search">&nbsp;搜索</i>
									</button>
								</li>
								<li>
									<button id="manager_clear" type="button">
										<i class="fa fa-repeat">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">搜索条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="manager_name">
											<label for="manager_name">部门负责人</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="manager_deptname">
											<label for="manager_deptname">部门名</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<h3 class="block-title">部门负责人一览</h3>
						</div>
						<div class="block-content">
							<table id="departmanager" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_nextdepartadd" tabindex="-1" role="dialog"
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
						<h3 class="block-title">部门信息</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<form class="form-horizontal" id="form_nextdepartadd"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_linkHrDepart" tabindex="-1" role="dialog"
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
						<h3 class="block-title">关联HR部门</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group">
							<div class="col-sm-12" style="display: none;">
								<div class="form-material">
									<input class="form-control" type="text" id="linkHr_departId">
									<label for="linkHr_departId">部门ID</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" type="text" id="linkHr_hrDepart">
									<label for="linkHr_hrDepart">HR部门</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer" style="height: auto; overflow: visible;">
					<div class="row">
						<button class="btn btn-md btn-primary" id="btn_linkHrDepart"><i class="fa fa-link"></i>&nbsp;关联</button>
						<button class="btn btn-md btn-warning" data-dismiss="modal"><i class="fa fa-sign-out"></i>&nbsp;关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_switchisVisable" tabindex="-1" role="dialog"
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
						<h3 class="block-title">切换是否业务部门</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group">
							<div class="col-sm-12" style="display: none;">
								<div class="form-material">
									<input class="form-control" type="text" id="switch_departId">
									<label for="switch_departId">部门ID</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="switch_isVisable">
									</select> <label for="switch_isVisable">是否业务部门</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer" style="height: auto; overflow: visible;">
					<div class="row">
						<button class="btn btn-md btn-primary" id="btn_switch"><i class="fa fa-save"></i>&nbsp;确定</button>
						<button class="btn btn-md btn-warning" data-dismiss="modal"><i class="fa fa-sign-out"></i>&nbsp;关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
	<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
	<script src="${pageContext.request.contextPath}/cpAdmin/departmentManage.js"></script>