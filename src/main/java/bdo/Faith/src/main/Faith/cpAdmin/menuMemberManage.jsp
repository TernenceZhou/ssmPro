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
				<h3 class="block-title">系统菜单</h3>
			</div>
			<div class="block-content">
				<table id="menu_tree">
				</table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_user" tabindex="-1" role="dialog"
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
						<h3 class="block-title">人员菜单对应详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_search" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_clear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_name" />
												<label for="search_name">姓名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<input class="form-control" type="text" id="search_dept" />
												<label for="search_dept">所属部门</label>
											</div>
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
									<button id="btn_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">详细信息一览</h3>
						</div>
						<div class="block-content">
							<table id="userTable" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" id="userClose">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_userRole" tabindex="-1" role="dialog"
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
						<h3 class="block-title">人员菜单对应详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_roleSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_roleClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<input class="form-control" type="text" id="search_roleDept" />
												<label for="search_roleDept">授权部门</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_roleName" />
												<label for="search_roleName">授权及角色</label>
											</div>
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
									<button id="btn_roleExport" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">菜单人员对应</h3>
						</div>
						<div class="block-content">
							<table id="roleTable" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" id="roleClose">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
	<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
	<script src="${pageContext.request.contextPath}/cpAdmin/menuMemberManage.js"></script>